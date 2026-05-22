import type { Metadata } from 'next';
import { Mouse_Memoirs, Story_Script } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import { ThemeProvider } from '../providers';
import Footer from '@/components/shared/Footer';
import { Patrick_Hand } from 'next/font/google';



export const metadata: Metadata = {
  title: 'Oasis Ascend - Portfolio',
  description: 'Showcase of digital marketing campaigns and creative work by Oasis Ascend',
};

export const mouseMemoirs = Mouse_Memoirs({
  subsets: ["latin"],
  weight: "400",
});



const patrick = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
});

export default function RootLayout({
children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${patrick.className} `}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
