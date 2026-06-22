'use client'
import { useConvexAuth } from "convex/react";
import { Box, Button, IconButton, Stack, Typography, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import PrimarySearchAppBar from "../searchPosts/searchPosts";

export default function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);



  const navLinks = (
  <>
    <Link href='/'>
      <Button sx={{ fontSize: { xs: '16px', sm: '20px', md: '30px' }, fontWeight: 600, color: 'text.primary' }}>
        Home
      </Button>
    </Link>
    <Link href='/Create'>
      <Button sx={{ fontSize: { xs: '16px', sm: '20px', md: '30px' }, fontWeight: 600, color: 'text.primary' }}>
        Create
      </Button>
    </Link>
    <Link href='/blog'>
      <Button sx={{ fontSize: { xs: '16px', sm: '20px', md: '30px' }, fontWeight: 600, color: 'text.primary' }}>
        Blog
      </Button>
    </Link>
  </>
);

  const authButtons = isLoading ? (
    <Button loading sx={{ fontWeight: 500, fontSize: '15px', textTransform: 'none' }}>Loading...</Button>
  ) : isAuthenticated ? (
    <Button 
      variant="contained" 
      sx={{ fontWeight: 600, fontSize: '15px', textTransform: 'none', px: 3 }}
      onClick={() => { authClient.signOut({}); router.push('/'); }}
    >
      Logout
    </Button>
  ) : (
    <Stack direction={{xs:'column',md:"row"}} spacing={1}>
      <Link href='/auth/login'>
        <Button sx={{ fontWeight: 500, fontSize: '15px', textTransform: 'none' }}>Login</Button>
      </Link>
      <Link href='/auth/sign-up'>
        <Button variant="contained" sx={{ fontWeight: 600, fontSize: '15px', textTransform: 'none', px: 3 }}>
          Sign Up
        </Button>
      </Link>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, width: '100%', gap: 3 }}>
      
          <Typography sx={{ 
            fontSize: { xs: '20px', sm: '24px', md: '30px' }, 
            color: 'text.primary', 
            fontWeight: 600,
            flexShrink: 0
          }}>
            Next<Typography color="primary" component="span" sx={{ fontSize: 'inherit', fontWeight: 600 }}>Pro</Typography>
          </Typography>

      <Box sx={{ flex: 1, maxWidth: 450 }}>
        <PrimarySearchAppBar />
      </Box>

      {isMobile ? (
        <>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Stack spacing={2} sx={{ p: 3, width: 220 }} onClick={() => setDrawerOpen(false)}>
              {navLinks}
              {authButtons}
            </Stack>
          </Drawer>
        </>
      ) : (
        <Stack direction="row" spacing={3} >
          {navLinks}
          {authButtons}
        </Stack>
      )}
    </Box>
  );
}