 
"use client"

import { Box, createTheme ,IconButton,Stack,ThemeProvider} from "@mui/material";
import { ReactNode, useEffect, useState } from "react"
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';



export default function PageMode({children}:{children:ReactNode}){


 const [mode, setMode] = useState<'light' | 'dark'>(() => {
  if (typeof window === 'undefined') return 'dark'; 
  return (localStorage.getItem('mode') as 'light' | 'dark') || 'dark';
});

useEffect(() => {
  localStorage.setItem('mode', mode);
}, [mode]);
    
     const theme=   createTheme  ({
            palette:{
            background: {
            default: mode === 'dark'? "#000000" : "#f5f5f5",
            paper: mode === 'dark' ? "#090909" : "#ececec",
    },
                mode,
                primary:{main: mode==='dark'?'#6300dd':'#40008f',
                },
            text:{

              primary:mode=== 'dark' ? '#fff':'#000000'
            },
          error: {
            main: '#981c1c'
          },
          success: {
            main: '#07a70c'
          }
            }
        })
     return(
        <ThemeProvider theme={theme}>
          <Box sx={{bgcolor:'background.paper', height:'100vh'}}>
     <Stack direction='row' sx={{alignItems:'center',bgcolor:'background.paper'}}>
        <IconButton color='primary'
  onClick={() =>
    setMode(mode === 'light' ? 'dark' : 'light')
  }
>
  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
</IconButton>        
     </Stack>

               {children}            
          </Box>

        </ThemeProvider>
     )

}