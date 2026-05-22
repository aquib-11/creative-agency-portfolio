import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";


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
      <body >
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}