import {connectToDB} from "@utils/database";
import Prompt from '@models/prompt'

export const GET = async (request) => {
    try {
        await connectToDB();

        const prompts = await Prompt.find({}).populate('creator');

        if(!prompts) return new Response("Prompt not found", {status:404})

        return new Response(JSON.stringify(prompts), {status:200})
    } catch (error) {
    
        return new Response("Failed to fetch all prompts", {status:500})
    }
}

