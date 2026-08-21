import type { Metadata } from 'next';
import './globals.css';
import './console.css';
import 'leaflet/dist/leaflet.css'; // ⚠ Leaflet will not render without its own stylesheet.

export const metadata: Metadata = {
  title: 'Vantage Transport Management',
  description:
    'Demo build of the Vantage Transport Management console for TVSH. Seeded data, no server, not the production module.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
