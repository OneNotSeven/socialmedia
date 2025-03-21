import "../globals.css"
import type { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Quest Castle',
  description: 'Authorization page of Quest Castle',
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