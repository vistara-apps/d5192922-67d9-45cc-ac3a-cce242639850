import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PeerLink - Connect, Learn, and Earn with Your Peers',
  description: 'A web3-native platform for students to exchange academic help, practical skills, and study resources through peer-to-peer interactions.',
  keywords: ['peer tutoring', 'skill exchange', 'study groups', 'web3', 'Base', 'education'],
  authors: [{ name: 'PeerLink Team' }],
  openGraph: {
    title: 'PeerLink - Connect, Learn, and Earn with Your Peers',
    description: 'A web3-native platform for students to exchange academic help, practical skills, and study resources.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
