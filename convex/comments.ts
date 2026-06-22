import { mutation, query } from "./_generated/server";
import {ConvexError, v} from 'convex/values'
import { authComponent } from "./auth";

export const getCommentsByPost=query({
    args:{
        postId:v.id('Posts'),
    },
    handler: async(ctx,args)=>{
        const comments=await ctx.db.query('Comments').filter((q)=>q.eq(q.field('postId'),args.postId)).order('desc').collect();

        return comments

    }
})


export const CreateComment=mutation({
    args:{
        body:v.string(),
        postId:v.id('Posts'),
    },
    handler:async(ctx,args)=>{
     
    const user = await authComponent.safeGetAuthUser(ctx)
      if (!user) throw new ConvexError('Not authenticated')
        return await ctx.db.insert('Comments',{
            postId:args.postId,
            body:args.body,
            authorId:user._id,
            authorName:user.name,
            

        })
    }
})
