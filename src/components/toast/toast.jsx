'use client'

import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useToastContext } from '@/context/toastContext/toastContext';
export default function CustomizedSnackbars() {
   const Toast=useToastContext();
   if(!Toast) return;
   const {open,setOpen,error,status}=Toast;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
