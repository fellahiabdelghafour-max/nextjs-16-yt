import { api } from "../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import CommentsForm from "@/components/commentsForm/comments";
import { getToken } from "@/lib/auth-server";
import PresenceComponent from "@/components/presence/presenceComponent";
import { redirect } from "next/navigation";


export function generateMetadata (){
      return{
        title:'posts'
      }
}

interface pageProps{
    params:Promise<{postId:Id<'Posts'>}>
}

export const dynamic = 'force-dynamic'
export default async function Post({params}:pageProps){

      const {postId}=await params;
        const token= await getToken();
        if(!token){
           redirect('/auth/login')
        }
       const user= await fetchQuery(api.posts.getUser,{},{token})
        const post=await fetchQuery(api.posts.getPostById,{PostId:postId})
        if(!post){
            return(<Box sx={{display:'flex',
            alignItems:'center',
            justifyContent:'center',
            minHeight:'100vh'}}>
                   <Typography variant="h4" color='error'>
                       No Post try again
                   </Typography>
            </Box>)
        }

    return(<Box
    sx={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        minHeight:'100vh',
        p:2,
        bgcolor:'background.default'
        }}>
            <Stack>
                    <Link href='/blog'>
                        <Button variant="contained"
                        sx={{
                            mb:2
                        }}>
                            Go Back <ArrowBack/>   
                        </Button>
                    </Link>
        <Card 
    sx={{
        borderRadius: '16px',
        p:1,
        m:1,
        width:{xs:'300px',sm:'400px',md:'600px'},
        ':hover':{
        width:{xs:'320px',sm:'420px',md:'620px'},
            transition:'0.5s'
        }
        }}>

                    <Box sx={{ 
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        position: 'relative',
                        width:'100%',
                        height:{xs:'300px',sm:'400px',md:'500px'},
                        }}>
                                    <Image

                          src={ post.image || 'https://cdn-icons-png.flaticon.com/128/8346/8346099.png'}
                          alt="mountain"
                          fill
                           loading="eager"
                          style={{ 
                            objectFit: 'cover', 
                            borderRadius: '16px' 
                            }}
                        />
                    </Box>

              <Box  sx={{height:'40px',
                fontSize:'25px',
                fontWeight:800,
                mt:2,
                }}>
                {post.title}
              </Box>

              <Typography
            variant="subtitle1"
              sx={{whiteSpace:'wrap',
                mb:2,
                fontSize:'20px',
                fontWeight:500
              }}
              >
                { post.body}
              </Typography>
              <hr />
              <Typography
              color='textDisabled'
                sx={{whiteSpace:'wrap',
                mb:2,
              }}
              >
                Created on: {new Date(post._creationTime ?? 0).toLocaleDateString('en-US') }
              </Typography>
              <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%'}}>
              {post._id && user.user  && <PresenceComponent roomId={post._id} userId={user.user?._id } userName={user.user?.name}/>}
              </Box>
                    <CommentsForm postId={postId}/>             
                  </Card>    
            </Stack>

           
      
        </Box>
)
}
