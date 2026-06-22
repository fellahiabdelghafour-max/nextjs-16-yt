import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  cacheComponents: false,
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.c;om',
    },
    {
      protocol:'https',
      hostname:"shiny-narwhal-96.eu-west-1.convex.cloud",
      port:''
    },
    {
      protocol:'https',
      hostname:'encrypted-tbn0.gstatic.com',
      port:''
    },
    {
      protocol:'https',
      hostname:'cdn-icons-png.flaticon.com',
      port:''
    }
  ],
},
};


export default nextConfig;
