import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "@/styles/globals.scss";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Game Project Manager",
  description: "Tickets, planning and shared resources for the game team.",
};

export const viewport = {
  themeColor: "#0B1E33",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plexMono.variable} ${plexSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
