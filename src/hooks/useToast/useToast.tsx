import { useState } from "react";

export default function useToast(){

      const [open, setOpen]=useState<boolean>(false);
      const [error,setError]=useState<string>('');
      const [status,setStatus]=useState<('success'|'error')>('error')
      function handleStatus(status:('error'|'success')){
            setStatus(status)
      }


     function handleError(Error:string){
        setError(Error)
     }

        const handleClick = () => {
    setOpen(true);
  };

      return{open,setOpen,handleClick,error,handleError,status,handleStatus}
}