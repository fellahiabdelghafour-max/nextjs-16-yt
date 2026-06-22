"use client"
import { useContext,createContext, ReactNode } from "react";
import useToast from "@/hooks/useToast/useToast";

    const ToastContext=createContext<ReturnType<typeof useToast>|null>(null);

 export default function ToastProvider({children}:{children:ReactNode}){
    const Toast=useToast();
    


    return (
        <ToastContext.Provider value={Toast}>
            {children}
        </ToastContext.Provider>
    )
 }

 export const useToastContext=()=>useContext(ToastContext);
  
