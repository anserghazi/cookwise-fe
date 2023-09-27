import React, { useEffect, useState } from 'react';
import './Chat.css'
import UserEntry from './UserEntry';
import Message from './Message'
import WelcomeMessage from './WelcomeMessage';

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
    id: string,
    key: string,
    url: string,
    video_title: string,
    channel_name: string,
    channel_url: string,
    recipe_name: string,
    recipe: string
}

export default function Chat({menu, messages, setMessages, recipes, setRecipes, chatSessions, setChatSessions, currentSessionId, setCurrentSessionId}: {menu: any, messages: Array<IMessage>, setMessages: React.Dispatch<React.SetStateAction<Array<IMessage>>>, recipes: Array<IRecipe>, setRecipes: React.Dispatch<React.SetStateAction<Array<IRecipe>>>, chatSessions: Array<string>, setChatSessions: React.Dispatch<React.SetStateAction<Array<string>>>, currentSessionId: string, setCurrentSessionId: React.Dispatch<React.SetStateAction<string>>}) {
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [sliderValue, setSliderValue] = useState("rapid");

    useEffect(() => {
        // Establish WebSocket connection when the component mounts
        const newSocket = new WebSocket('wss://live.cookwise.app');
        setSocket(newSocket);
    
        // Clean up WebSocket connection when the component unmounts
        return () => {
          if (newSocket) {
            newSocket.close();
          }
        };
    }, []); // Empty dependency array to run the effect only once

    function Messages() {
        let Messages = messages.map((message: { request: { key: string, text: string }, response: { key: string, text: string }, key: string}) => { 
            return <Message 
                request={{
                    key: message.request.key, 
                    text: message.request.text
                }} 
                response={{
                    key: message.response.key, 
                    text: message.response.text
                }} 
                key={message.key}></Message>})
        if (Messages.length == 0) {
            return <WelcomeMessage setSliderValue={setSliderValue}></WelcomeMessage>
        }
        
        return Messages;
    }

    return (
        <>
            <div className='Chat' id="Chat">
                {Messages()}
            </div>
            <div className='Fade'></div>
            <UserEntry menu={menu} inputValue={inputValue} setInputValue={setInputValue} chatMessages={messages} setChatMessages={setMessages} recipes={recipes} setRecipes={setRecipes} chatSessions={chatSessions} setChatSessions={setChatSessions} currentSessionId={currentSessionId} setCurrentSessionId={setCurrentSessionId} socket={socket} sliderValue={sliderValue}></UserEntry>
        </>
    )
}