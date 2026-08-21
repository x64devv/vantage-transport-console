'use client';

/* Leaflet + OSM tiles + OSRM road routing, with Modernist square markers.
 *
 * Ported from design/trip-map.js. The framework changed; the rules did not:
 *
 * ⚠⚠ A straight line never pretends to be a route. Legs are drawn dashed the
 *    moment stops change, and are replaced by real road geometry only when a
 *    road answer exists. If the router never answers, the dashed line stays.
 * ⚠  The OSM attribution is a licence requirement. It is not decoration and it
 *    is never removed, hidden or shrunk to nothing.
 * ⚠  Seeded stop orders come from lib/routes-cache.ts and need no network.
 */

import { useEffect, useRef } from 'react';
import type * as LType from 'leaflet';
import { cachedRoute, fetchRoute } from '@/lib/routing';

const INK = '#201e1d';
const ACCENT = '#ec3013';
const BG = '#f3f2f2';

export type MapStop = { n: number; label: string; lat: number; lng: number };
export type MapVehicle = { label: string; lat: number; lng: number; stale?: boolean };
export type MapPin = { label?: string; lat: number; lng: number };

export type TripMapProps = {
  center?: [number, number];
  zoom?: number;
  depot?: { label: string; lat: number; lng: number };
  stops?: MapStop[];
  /** Suburb sequence for the current stop order — the key into the route cache. */
  routeKeySuburbs?: string[];
  line?: boolean;
  vehicles?: MapVehicle[];
  pins?: MapPin[];
};

function squareIcon(L: typeof LType, bg: string, fg: string, text: string, size: number) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html:
      `<div style="width:${size}px;height:${size}px;background:${bg};color:${fg};` +
      `font:600 ${Math.round(size * 0.55)}px/1 ui-monospace,Menlo,monospace;` +
      `display:grid;place-items:center;box-shadow:0 0 0 1px rgba(32,30,29,.35)">${text || ''}</div>`,
  });
}

function labelIcon(L: typeof LType, text: string, muted?: boolean) {
  return L.divIcon({
    className: '',
    iconSize: [1, 1],
    iconAnchor: [-8, 7],
    html:
      `<div style="font:11px/1.2 Archivo,system-ui,sans-serif;color:${muted ? '#605d5d' : INK};` +
      `background:${BG};padding:1px 4px;white-space:nowrap;` +
      `box-shadow:0 0 0 1px rgba(32,30,29,.18)">${text}</div>`,
  });
}

export default function TripMap(props: TripMapProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const layerRef = useRef<LType.LayerGroup | null>(null);
  const LRef = useRef<typeof LType | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // One-time map creation. Leaflet is imported dynamically because it touches
  // `window` at module scope and this bundle is prerendered at build time.
  useEffect(() => {
    let cancelled = false;
    let ro: ResizeObserver | null = null;

    import('leaflet').then((mod) => {
      const L = (mod.default ?? mod) as typeof LType;
      if (cancelled || !hostRef.current || mapRef.current) return;
      LRef.current = L;
      const p = propsRef.current;
      const map = L.map(hostRef.current, {
        center: p.center ?? [-17.84, 31.06],
        zoom: p.zoom ?? 11,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: false,
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors', // ⚠ licence requirement
        maxZoom: 18,
      }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      draw();

      if (typeof ResizeObserver !== 'undefined' && hostRef.current) {
        ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(hostRef.current);
      }
    });

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawRoute(coords: [number, number][], provisional: boolean) {
    const L = LRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    // A ground halo under the accent line so the route reads over dark tiles.
    L.polyline(coords, { color: BG, weight: 8, opacity: 0.55 }).addTo(layer);
    L.polyline(coords, {
      color: ACCENT,
      weight: 4,
      opacity: 0.95,
      // ⚠⚠ Dashed means "these are straight legs, not a road route". It is the
      //    map's way of saying it does not know yet, or cannot find out.
      dashArray: provisional ? '5,6' : undefined,
    }).addTo(layer);
  }

  function draw() {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;
    const d = propsRef.current;

    layer.clearLayers();
    const bounds: [number, number][] = [];

    if (d.depot) {
      L.marker([d.depot.lat, d.depot.lng], { icon: squareIcon(L, ACCENT, BG, 'D', 20) }).addTo(layer);
      L.marker([d.depot.lat, d.depot.lng], { icon: labelIcon(L, d.depot.label || 'Depot') }).addTo(layer);
      bounds.push([d.depot.lat, d.depot.lng]);
    }

    (d.stops || []).forEach((s) => {
      L.marker([s.lat, s.lng], { icon: squareIcon(L, INK, BG, String(s.n), 20) }).addTo(layer);
      L.marker([s.lat, s.lng], { icon: labelIcon(L, s.label) }).addTo(layer);
      bounds.push([s.lat, s.lng]);
    });

    if (d.line && (d.stops || []).length) {
      const straight: [number, number][] = [];
      if (d.depot) straight.push([d.depot.lat, d.depot.lng]);
      (d.stops || []).forEach((s) => straight.push([s.lat, s.lng]));
      if (d.depot) straight.push([d.depot.lat, d.depot.lng]);

      const suburbs = d.routeKeySuburbs || [];
      const known = suburbs.length ? cachedRoute(suburbs) : undefined;

      if (known?.coords?.length) {
        drawRoute(known.coords as [number, number][], false);
      } else {
        drawRoute(straight, true);
        if (suburbs.length) {
          fetchRoute(suburbs).then((r) => {
            // Only upgrade the line if this map is still showing the same order.
            const stillCurrent =
              (propsRef.current.routeKeySuburbs || []).join('>') === suburbs.join('>');
            if (r?.coords?.length && stillCurrent && layerRef.current) {
              draw();
            }
          });
        }
      }
    }

    (d.vehicles || []).forEach((v) => {
      L.marker([v.lat, v.lng], { icon: squareIcon(L, INK, BG, '', 13) }).addTo(layer);
      L.marker([v.lat, v.lng], {
        icon: labelIcon(L, v.label + (v.stale ? ' · stale' : ''), v.stale),
      }).addTo(layer);
      bounds.push([v.lat, v.lng]);
    });

    (d.pins || []).forEach((p) => {
      L.marker([p.lat, p.lng], { icon: squareIcon(L, ACCENT, BG, '', 9) }).addTo(layer);
      if (p.label) L.marker([p.lat, p.lng], { icon: labelIcon(L, p.label, true) }).addTo(layer);
      bounds.push([p.lat, p.lng]);
    });

    if (bounds.length > 1) map.fitBounds(bounds, { padding: [34, 34], maxZoom: 13 });
  }

  // Redraw whenever the stop order, vehicles or pins change.
  const signature = JSON.stringify([props.stops, props.vehicles, props.pins, props.routeKeySuburbs, props.line]);
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0, background: 'var(--color-surface)' }} />;
}
