import { Box, Typography } from "@mui/material";

  
export default function Home() {
  console.log("SITE_URL =", process.env.SITE_URL);
console.log("BETTER_AUTH_SECRET =", process.env.BETTER_AUTH_SECRET);
  return (
<Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
             <Typography sx={{fontSize:{xs:'20px',sm:'30px',md:'40px'},fontWeight:600,color:'text.primary'}}>
               This is the home page
           </Typography>
    </Box>
  );
}
