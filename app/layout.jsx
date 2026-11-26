import "swiper/css";
import "swiper/css/a11y";
import { siteDescription, siteName, siteUrl } from "../lib/site";
import "./fonts.css";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  icons: { icon: "/assets/brand/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
