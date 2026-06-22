'use server'
import {z } from 'zod'
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getToken } from '@/lib/auth-server';
import { CommentsSchema } from '../../../convex/schema';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  image:z.instanceof(File).optional()
});

export default async function CreateBlogAction(values:z.infer<typeof postSchema>){
     
    const parsed= postSchema.safeParse(values);
    if(!parsed.success){
        throw new Error('somithing went wrong');
    };

  const token = await getToken();

   try{
       const ImageUrl= await fetchMutation(
        api.posts.generateImageUploadUrl
        ,{
        
       }
         ,{token})

         const uploadResult= await fetch(ImageUrl,{
            method:'POST',
            headers:{
                'Content-Type':parsed.data.image?.type  || 'application/octet-stream'
            },
            body:parsed.data.image
         })
            
         if(!uploadResult.ok){
            return{
                error:"Failed to upload image"
            }
         }
         const {storageId}=await uploadResult.json();

    await fetchMutation(
        api.posts.CreatePost,
        {
            body:parsed.data.body,
            title:parsed.data.title,
            image:storageId
        }
        ,
        {token});
   }catch{
            return{
                error:"Failed to Create Post"
            }
   }
}



 export async function CreateComment(values:z.infer<typeof CommentsSchema>){

    const parsed = CommentsSchema.safeParse(values);
       const token =await getToken();
    if(!parsed || !token) throw new Error ('Somthing went wrong')

        

        try{
          await fetchMutation(
            api.comments.CreateComment,
            {
                body:parsed.data?.body|| '',
                postId:parsed.data?.postId|| values.postId,
            },
            {token}
           )
        }catch{}

        return 'success'

}


