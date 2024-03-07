import {connectToDB} from "@utils/database";
import Prompt from '@models/prompt'


// GET (read)
export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        const prompt = await Prompt.findById(params.id).populate('creator');

        if(!prompt) return new Response("Prompt not found", {status:404})

        return new Response(JSON.stringify(prompt), {status:200})
    } catch (error) {
        return new Response("Failed to fetch prompt", {status:500})
    }
}


// PATCH (update)
export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();
    try {
        await connectToDB();

        const existingPrompt = await Prompt.findById(params.id);

        if(!existingPrompt) return new Response("Prompt not found", {status:404})

        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response(JSON.stringify(existingPrompt), {status:200})
    } catch (error) {
        return new Response("Failed to update the prompts", {status:500})
    }
};




// DELETE (delete)

// export const DELETE = async (request, { params }) => {
//     try {
//          await connectToDB();
//         deletedPost = await Prompt.findByIdAndRemove(params.id);

//          if(!deletedPost) {
//             return new Response("Prompt not found", {status:404})
//          }

//          return new Response("Prompt deleted succesfully", {status:200})


//     } catch (error) {
//         return new Response ("failed to delete prompt", {status:500})
//     }
// };


export const DELETE = async (request, { params }) => {
    try {
        await connectToDB(); // Establish connection to the database
        const deletedPost = await Prompt.findByIdAndDelete(params.id);

        if (!deletedPost) {
            // Return a 404 status code along with a meaningful error message
            return new Response("Prompt not found", { status: 404 });
        }

        // Return a success message with a 200 status code
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Failed to delete prompt:", error); // Log the error for debugging purposes
        // Return an error message along with a 500 status code
        return new Response("Failed to delete prompt", { status: 500 });
    }
};
