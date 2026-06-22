import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

export default function SignLayout({children}:{children:ReactNode}){
        
    return(
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',bgcolor:"background.paper"}}>
        <Stack>
            <Link href='/'>
                <Button variant="contained">
                    Go Back <ArrowBack/>
                    
                </Button>
            </Link>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                {children}
            </Box>
                        
        </Stack>

        </Box>
    )
}