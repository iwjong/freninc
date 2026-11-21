import "swiper/css";
import "swiper/css/a11y";
import "./globals.css";

export const metadata = {
  title: "FREN Inc.",
  description: "FREN combines physical design, original artwork and interactive technology to create experiences for care, learning and play.",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/brand/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
