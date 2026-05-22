import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../../globals.css";
import AuthGuard from "@/components/shared/AuthGaurd";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oasis Ascend - Portfolio",
  description:
    "Showcase of digital marketing campaigns and creative work by Oasis Ascend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}