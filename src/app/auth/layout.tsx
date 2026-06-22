import { ReactNode } from "react";
import PageMode from "@/components/[dark-light]M/pageMode";
import { Geist, Geist_Mono } from "next/font/google";
import ToastProvider from '@/context/toastContext/toastContext'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function Layout({children}:{children:ReactNode}){
    return(
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
          <body style={{margin:0}}>
            <ToastProvider>
          <PageMode>
            {children}
          </PageMode>
            </ToastProvider>
   

          </body>

           
                
        </html>
    )
}