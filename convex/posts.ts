import { mutation, query } from "./_generated/server";
import {v,ConvexError} from 'convex/values';
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const CreatePost= mutation({
    args:{title:v.string(),body:v.string(),image:v.id('_storage')},
    handler: async (ctx,args)=>{
         const user=await authComponent.safeGetAuthUser(ctx);

         if (!user){
            throw new ConvexError('Not authenticated');
         }
         const blogArticle =await ctx.db.insert('Posts',{
            title:args.title,
            body:args.body,
            authorId:user._id,
            image:args.image
         })

         return blogArticle;
    }
})

export const getPosts=query({
   args:{},
   handler:async (ctx)=>{
      const posts= await ctx.db.query('Posts').order('desc').collect();
       const PostsWithImage=Promise.all(posts.map(async(post)=>{
            const imageUrl= post.image !==undefined ? await ctx.storage.getUrl(post.image) : null
            return {...post,image:imageUrl}
       }))
      return PostsWithImage;
   }
})

export const generateImageUploadUrl= mutation({
   args:{},
   handler:async (ctx)=> {
       const user= await authComponent.safeGetAuthUser(ctx)
       if (!user) throw new ConvexError('Not authenticated')

         return ctx.storage.generateUploadUrl()
   }
})

export const getPostById=query({
   args:{PostId:v.id('Posts')},
   handler:async (ctx,args)=>{
        const post=await ctx.db.get(args.PostId);
           const ImageUrl=post?.image !==undefined?
           await ctx.storage.getUrl(post.image):
           null
      
           return{
            ...post,
            image:ImageUrl
           }
   }
})

export const getUser=query({
   args:{},
     handler:async(ctx)=>{
          const user=await authComponent.safeGetAuthUser(ctx)

          return {user}
     }
})

export interface searchResults{
    _id:string;
    body:string;
    title:string;
}
export const searchPosts= query({
    args:{
        term:v.string(),
        limit:v.number(),
    },
    handler:async (ctx,args)=>{
      const limit=args.limit;
      const results:Array<searchResults>=[];
      const seen= new Set();
      
      const pushDocs= async(docs:Array<Doc<'Posts'>>)=>{
          for (const doc of docs){
            if(seen.has(doc._id)) continue;

            seen.add(doc._id);
            results.push({
               _id:doc._id,
               title:doc.title,
               body:doc.body,
               
            })
            if (results.length>= limit) break
          }
      };
      const titleMatches=await ctx.db.query('Posts')
      .withSearchIndex('searchByTitle',(q=>q.search('title',args.term)))
      .take(limit)
      await pushDocs(titleMatches)

      if(results.length<limit){
         const bodyMtches = await ctx.db.query('Posts')
         .withSearchIndex('searchByBody',(q=>q.search('body',args.term)))
         .take(limit);
         await pushDocs(bodyMtches)
      }
      return results;
    }
})

