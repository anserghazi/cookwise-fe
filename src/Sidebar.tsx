import './Sidebar.css';
import Recipe from './Recipe'
import { useState, Component, useEffect } from 'react';
const { v4: uuidv4 } = require('uuid');


interface IMessage {
    request: {
        key: string,
        text: string
    },
    response: {
        key: string,
        text: string
    },
    key: string
}

interface IRecipe {
    key: string,
    url: string,
    video_title: string,
    channel_name: string,
    channel_url: string,
    recipe_name: string,
    recipe: string
}

export default function Sidebar({messages, setMessages, recipes, chatSessions, setChatSessions, currentSessionId, setCurrentSessionId}: {messages: Array<IMessage>, setMessages: React.Dispatch<React.SetStateAction<Array<IMessage>>>, recipes: Array<IRecipe>, chatSessions: Array<string>, setChatSessions: React.Dispatch<React.SetStateAction<Array<string>>>, currentSessionId: string, setCurrentSessionId: React.Dispatch<React.SetStateAction<string>>}) {
    const [clearChat, setClearChat] = useState(false);

    useEffect(() => {
        setMessages([])
        let newSessionId = uuidv4();
        setCurrentSessionId(newSessionId)
        setChatSessions((prevSessions) => [...prevSessions, currentSessionId])
    }, [clearChat])

    function allRecipes() {
        let Recipes = recipes.map((recipe: { key: string, url: string, video_title: string, channel_name: string, channel_url: string, recipe_name: string, recipe: string}) => { 
            return <Recipe key={uuidv4()} videoUrl={recipe.url} videoTitle={recipe.video_title} channelUrl={recipe.channel_url} channelName={recipe.channel_name} recipeName={recipe.recipe_name} recipe={recipe.recipe}></Recipe>
        })
        return Recipes
    }
    // console.log(recipes) //  uncomment this for debugging
    function newChat() {
        clearChat ? setClearChat(false) : setClearChat(true)
        // setClearChat(true)
    }
    return (
        <div className="sidebar">
            <button className='newChat' onClick={newChat}>New Chat</button>
            <div className='recipeList'>
                {allRecipes()}
            </div>
            <div className='userLogin'>
                <button className='authenticationButton'>Log In</button>
                <button className='authenticationButton'>Sign Up</button>
            </div>
        </div>
    )
}