"use client";

import { useState,useEffect } from "react";

import PromptCard from "./promptcard";

const PromptCardList = ({data, handleTagClick}) => {
    return (
        <div className="mt-16 prompt_layout">
           {data.map((post) => (
            <PromptCard 
            key={post._id}
            post={post}
            handleTagClick ={handleTagClick}/>
           ))}
        </div>
    )
};


const Feed = () => {
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    const [posts, setPosts] = useState([]);

    
    // useEffect( () => {
    //     const fetchPosts = async () => {
    //         const response = await fetch('/api/prompt');
    //         const data = await response.json();

    //         setPosts(data);
   
    //     }
    //     fetchPosts();

    // }, []);


    
    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/prompt');
            const data = await response.json();

            setPosts(data);

        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const longPoll = async () => {
        try {
            await fetchPosts(); // Initial fetch
            while (true) {
                // Continuously poll for updates
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
                await fetchPosts();
            }
        } catch (error) {
            console.error('Long polling error:', error);
        }
    };

    useEffect(() => {
        longPoll(); // Start long polling
    }, []);


    const filterPrompts = (searchtext) => {
        const regex = new RegExp(searchtext, "i");
        return posts.filter(
            (item) => 
            regex.test(item.creator.username) || 
            regex.test(item.tag) ||
            regex.test(item.prompt)
        );
    };

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout( () => {
                const searchResult = filterPrompts(e.target.value);
                setSearchedResults(searchResult);
            },500)
        );    
    };

    const handleTagClick = (tagName) => {
        setSearchText(tagName);

        const searchResult = filterPrompts(tagName);
        setSearchedResults(searchResult);
    };

   
    


    return (
        <section className="feed">
            <form className="relative w-full flex-center">
                <input
                type="text"
                placeholder="Search for prompt, tag or username"
                value={searchText}
                onChange={handleSearchChange}
                required
                className="search_input peer"/>
            </form>


            {searchText ? (
                  <PromptCardList 
                  data = {searchedResults}
                  handleTagClick = {handleTagClick} />

            ) : (
                <PromptCardList 
                data = {posts}
                handleTagClick = {handleTagClick} />
            )};

        </section>
    )
}


export default Feed;