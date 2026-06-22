import { defineSchema,defineTable } from "convex/server";
import {v} from 'convex/values';
import { Id } from "./_generated/dataModel";
import {z} from 'zod';

export default defineSchema({
    Posts:defineTable({
        title:v.string(),
        body:v.string(),
        authorId: v.string(),
        image:v.optional(v.id('_storage')),
    })
    .searchIndex('searchByTitle',
        {
            searchField:'title',
        })
    .searchIndex('searchByBody',{
        searchField:'body'
    }),
   Comments:defineTable({
      body:v.string(),
      postId:v.id('Posts'),
      authorId:v.string(),
      authorName:v.string()
   })
})

 export const CommentsSchema= z.object({
    body:z.string(),
    postId:z.custom<Id<'Posts'>>(),
    authorId:z.string(),
    authorName:z.string(),
})
