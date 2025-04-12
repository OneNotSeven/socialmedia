import "../globals.css"
import type { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Twins',
  description: 'Authorization page of Twins',
}

export default function RootLayout({ children }:Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      
        {children}</body>
    </html>
  )
}
