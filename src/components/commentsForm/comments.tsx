'use client'

import { z } from "zod"
import { Id } from "../../../convex/_generated/dataModel"
import { useState, useTransition } from "react"
import {CreateComment} from '@/hooks/serverAction/sverAction'
import { Avatar, Box, Button, Card, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material"
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { CommentsSchema } from "../../../convex/schema"
import { useToastContext } from "@/context/toastContext/toastContext"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { authClient } from "@/lib/auth-client"
import ModeCommentIcon from '@mui/icons-material/ModeComment';


interface PostsId{
    postId:Id<'Posts'>
}

export default function CommentsForm({postId}:PostsId){
    const [shoowComments,setShowComments]=useState(false)
     const comments=  useQuery(api.comments.getCommentsByPost,{
        postId:postId
     })
     console.log(comments)
      const [isPending,startTransition]=useTransition()
    const [commnet,setComment]=useState<z.infer<typeof CommentsSchema>>({
          postId:postId,
          body:'',
          authorId:'',
          authorName:''

    })
        const Toast=useToastContext();
      if(!Toast) return null
      const {handleClick,handleError,handleStatus}=Toast
      


    async function  onSubmite(){
          const user=await authClient.getSession();
          console.log(user)
        if(commnet.body===''){
            console.log(commnet.body)
           handleError('Empty Comment is not allowed');
           handleStatus('error');   
           handleClick();
           return null;

        }        
      startTransition(async ()=>{

        try{
          const data= await CreateComment(commnet);
          console.log(data)
          if(data!=='success') throw new Error('Not authenticated')
           handleError('Sucessed to Create Comment');
           handleStatus('success');
            setComment({...commnet,body:''})
          
        }
        catch{
            handleError('Not authenticated');
            handleStatus('error')
        }
        
        handleClick()        
      })

    }
      if(!comments) return <LoadingComments/>
    return(<Box >
        <Stack direction={'row'}
         sx={{
            m:1,
            borderBottom:'solid gray 1px '

         }}>
            <IconButton
            onClick={()=>{setShowComments(!shoowComments)}}>
               {!shoowComments?<ModeCommentOutlinedIcon/>:<ModeCommentIcon/>}
            </IconButton>
            <Typography variant="h5">
               {comments.length} comments
            </Typography>
        </Stack>
        <Typography
        sx={{
            fontWeight:'400',
            m:1
        }}>
            userName
        </Typography>
        <TextField 
        value={commnet.body}
        onClick={()=>
            setShowComments(true)
        }
        sx={{
            bgcolor:'background.default'
        }}
        fullWidth
        label='Comment'
        placeholder="Share your thoughts"
        onChange={(event)=>{setComment({
            ...commnet,
            body:event.target.value
        })}}/>
        <Button 
        loading={isPending}
        loadingPosition="start"
        onClick={onSubmite}
          sx={{
            mt:1
          }}
        variant="contained"
>Submit</Button>

{!comments? <LoadingComments/>:
  comments?.map((comment)=>{return(<Card key={comment._id} sx={{display:shoowComments?'':'none',borderRadius:'10px',m:2,p:1}}>
<Stack direction={'row'} spacing={2}>
     <Avatar
        alt={comments?comment.authorName:'User Name'}
        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzMghP5IrfqdRKWREBjZwiFJRB0P7lRQe7Q&s'
        sx={{  width: 40, height: 40 }}
      />   
      <Stack sx={{width:'100%'}}>
        <Stack direction={'row'} sx={{justifyContent: "space-between", width: "100%" }}>
        <Typography  sx={{fontWeight:'400',fontSize:'20px'}}>
            {comment.authorName} 
        </Typography>
        <Typography color="textDisabled" sx={{}}>
         {new Date(comment._creationTime??0).toLocaleDateString('en-US')}
        </Typography>                     
               
        </Stack>
         <Typography  color="textDisabled" sx={{ wordBreak:'break-word'}}>
            {comment.body}
        </Typography>          
        </Stack>        
       
      </Stack>
    </Card>
)})}    

    </Box>)
}


function LoadingComments(){
    
    return(<div>
      <Card  sx={{borderRadius:'10px',m:2,p:1}}>
                <Stack direction={'row'} spacing={2}>
                    <Skeleton variant="circular" width={40} height={40} />   
                    <Stack sx={{width:'100%'}}>
                        <Stack direction={'row'} sx={{justifyContent: "space-between", width: "100%" }}>
                        <Skeleton variant="rectangular" width={30} height={20} sx={{m:1}}/>
                        <Skeleton variant="rectangular" width={30} height={20} sx={{m:1}}/>                  
                            
                        </Stack>
                        <Skeleton variant="rectangular" width={400} height={40} sx={{m:1}}/>        
                        </Stack>        
                    
                    </Stack>
                    </Card>
      
    </div>
    )
}