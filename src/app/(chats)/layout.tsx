
import type { Metadata } from "next";
import "../globals.css"
import DirectMessageSidebar from "../_Components/ChatSidebar";
import Sidebar from "../_Components/Sidebar";
// import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body>
       
          
      <div className="flex overflow-hidden">
          <Sidebar check={true} />
        
          <DirectMessageSidebar/>
          {children}
        </div>
     
          
      </body>
    </html>
  );
}
