/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠ Static export: no server, no route handlers, no next/image optimisation.
  //   The demo must open from disk on a laptop with no network.
  output: 'export',
  // Trailing slashes so /transport/board/index.html resolves when the export is
  // opened straight off the filesystem rather than served.
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
