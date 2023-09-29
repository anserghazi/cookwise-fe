import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';

import { Alert, Collapse } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './UserEntry.css'
import styled from '@emotion/styled';

const { v4: uuidv4 } = require('uuid');

const CustomStyledCollapseWithMenu = styled(Collapse)(({ theme }) => ({
    zIndex: 4, 
    width: "65%",
    minWidth: '600px',
    position: 'absolute',
    bottom: 70, //10
    left: '17.5%',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 1210px)': {
        left: '15%',
        // minWidth: '600px',
        width: '69.2%',
        // minWidth: '0px',
    },
    '@media (max-width: 1100px)': {
        left: '15%',
        // minWidth: '500px',
        width: '70%',
        minWidth: '0px',
    },
    '@media (max-width: 1000px)': {
        left: '10%',
        // minWidth: '500px',
        width: '82%',
        minWidth: '0px',
    },
    '@media (max-width: 860px)': {
        left: '3.9%',
        width: '92%'
    },
    '@media (max-width: 649px)': {
        display: 'none'
    }
}))

const CustomStyledAlertWithMenu = styled(Alert)(({ theme }) => ({
    // "&&": {
    //     mb: 2,
    //     display: 'flex',
    //     height: 'auto', 
    //     flexDirection: 'column', 
    //     justifyContent: 'center', 
    //     alignContent: 'center', 
    //     alignItems: 'center',
    // },
    marginBottom: 2,
    display: 'flex',
    height: 'auto', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignContent: 'center', 
    alignItems: 'center',
    overflowX: 'hidden',
}))

const CustomStyledIconButtonWithMenu: any = styled(IconButton)(({ theme }) => ({
    position: 'absolute', 
    top: 3, 
    right: '.5%',
    '@media (max-width: 1100px)': {
        right: '.5%'
    }
}))


const CustomStyledCollapse = styled(Collapse)(({ theme }) => ({
    zIndex: 4, 
    width: "64.9%",
    minWidth: '620px',
    position: 'absolute',
    bottom: 65, //10
    left: '17.6%',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 1100px)': {
        left: '20%',
        // minWidth: '500px',
        width: '60%',
        minWidth: '0px',
    },
    '@media (max-width: 860px)': {
        left: '3.9%',
        width: '92%'
    },
    '@media (max-width: 650px)': {
        left: '3.9%',
        width: '92%'
    }
}))

const CustomStyledAlert = styled(Alert)(({ theme }) => ({
    // "&&": {
    //     mb: 2,
    //     display: 'flex',
    //     height: 'auto', 
    //     flexDirection: 'column', 
    //     justifyContent: 'center', 
    //     alignContent: 'center', 
    //     alignItems: 'center',
    // },
    marginBottom: 2,
    display: 'flex',
    height: 'auto', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignContent: 'center', 
    alignItems: 'center',
    overflowX: 'hidden',
}))

const CustomStyledIconButton: any = styled(IconButton)(({ theme }) => ({
    position: 'absolute', 
    top: 3, 
    right: '.5%',
    // '@media (max-width: 1100px)': {
    //     right: '0.6%'
    // },
    // '@media (max-width: 860px)': {
    //     right: '0.5%'
    // }
}))

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

interface recipeMetadata {
    videoTitle: string,
    videoURL: string,
    channelName: string,
    channelUrl: string
}

export default function UserEntry({menu, inputValue, setInputValue, chatMessages, setChatMessages, recipes, setRecipes, chatSessions, setChatSessions, currentSessionId, setCurrentSessionId, socket, sliderValue}: {menu: any, inputValue: string, setInputValue: React.Dispatch<React.SetStateAction<string>>, chatMessages: any, setChatMessages: any, recipes: Array<IRecipe>, setRecipes: React.Dispatch<React.SetStateAction<Array<IRecipe>>>, chatSessions: Array<string>, setChatSessions: React.Dispatch<React.SetStateAction<Array<string>>>, currentSessionId: string, setCurrentSessionId: React.Dispatch<React.SetStateAction<string>>, socket: WebSocket | null, sliderValue: any}) {
    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [newRecipe, setNewRecipe] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Please enter a valid Youtube URL (ex. https://www.youtube.com/watch?v=...)")
    const [sessionId, setSessionId] = useState("");
    const [count, setCount] = useState(0);

    function pullRecipesFromLocalStorage() {
        const recipesString = localStorage.getItem('recipes');
        let localRecipes;
        if (recipesString) {
            localRecipes =  JSON.parse(recipesString);
            console.log(localRecipes)
            setRecipes(localRecipes)
        }
    }

    // useEffect(() => {
    //     localStorage.setItem("recipes", JSON.stringify(recipes));
    // }, [recipes])

    useEffect(() => {
        pullRecipesFromLocalStorage();
    }, []);


    useEffect(() => {
        const currentCount = localStorage.getItem('count');
        const lastResetTime: any = localStorage.getItem('lastResetTime');
        const currentTime = new Date().getTime();
        
        if (lastResetTime && (currentTime - lastResetTime) > 1000 * 60 * 60 * 24) {
            // More than 24 hours have passed since the last reset
            setCount(0);
            localStorage.setItem('count', '0');
            localStorage.setItem('lastResetTime', currentTime.toString());
        } else if (currentCount) {
            setCount(parseInt(currentCount, 10));
            // window.alert("You've exceeded the request limit. Sign in or wait 24 hours to send more messages.")
        }


        // const currentCount = localStorage.getItem('count');
        // if (currentCount) {
        //     setCount(parseInt(currentCount, 10));
        // } else {
        //     // If the counter doesn't exist, initialize it to 0 in localStorage
        //     localStorage.setItem('count', '0');
        // }
    }, []);

    useEffect(() => {
        saveRecipe();
    }, [newRecipe])

    useEffect(() => {
        let chatDiv = document.getElementById("Chat") as HTMLDivElement
        if (isScrolledToBottom(chatDiv)) {
            // const totalScrollableArea = chatDiv.scrollHeight - chatDiv.clientHeight;
            // if (totalScrollableArea < 650) {
            chatDiv.scrollTop = chatDiv.scrollHeight;
            // }
            // else {
            //     scrollToBottom(chatDiv);
            // }
            
            
        }
    }, [chatMessages])

    useEffect(() => {
        if(chatMessages.length > 0) {
            let latestMessageId = chatMessages[chatMessages.length - 1].response.key;
            let latestMessage = document.getElementById(`p${latestMessageId}`)
            if (latestMessage) {
                if (isLoading) {
                    latestMessage.classList.add('typing')
                } 
                else {
                    latestMessage.classList.remove('typing')
                }
            }
        }
    }, [isLoading])

    let videoURL;
    let newSessionId: string;
    
    function findLatestStringWithKeywords(arr: Array<string>) {
        let keywords = ["Recipe:", "Ingredients"]
        for(let i = arr.length - 1; i >= 0; i--) {
            if(keywords.every(keyword => arr[i].toLowerCase().includes(keyword.toLowerCase()))) {
                return arr[i];
            }
        }
        return "no recipes detected"
    }

    async function saveRecipe() {
        if (chatMessages.length === 0) {
            newSessionId = uuidv4()
            setCurrentSessionId(newSessionId)
            // setCurrentId(newSessionId)
            setChatSessions((prevSessions: Array<any>) => [...prevSessions, newSessionId])
        }

        if (chatMessages.length > 0) {

            let potentialRecipes: string[] = []

            for (let messagePair of chatMessages) {
                potentialRecipes.push(messagePair.response.text)
            }

            let recipe: string = findLatestStringWithKeywords(potentialRecipes)

            videoURL = chatMessages[0].request.text

            if (chatMessages.length < 2) {
            
                let videoMetadata: recipeMetadata | undefined = await getVideoMetadata();

                // let newlineIndex = recipe.indexOf('\n');
                // let recipeIndex = recipe.indexOf(':')
                // let recipeName = recipe.substring(recipeIndex + 1, newlineIndex);

                // if (!(recipe === "no recipes detected") && (videoMetadata)) {
                //     let currentRecipe: IRecipe;
                //     if (recipes.length === 0) {
                //         currentRecipe = {
                //             key: newSessionId,
                //             video_title: videoMetadata.videoTitle,
                //             url: videoMetadata.videoURL,
                //             channel_name: videoMetadata.channelName,
                //             channel_url: videoMetadata.channelUrl,
                //             recipe_name: recipeName,
                //             recipe: recipe
                //         }
                //         console.log(currentRecipe)
                //         setRecipes(prevRecipes => [...prevRecipes, currentRecipe])
                //     }
                //     else {
                //         currentRecipe = recipes[recipes.length - 1]  //update to use recipes.at(-1)
                //         if (currentRecipe) {
                //             currentRecipe.video_title = videoMetadata.videoTitle
                //             currentRecipe.url = videoMetadata.videoURL
                //             currentRecipe.channel_name = videoMetadata.channelName
                //             currentRecipe.channel_url = videoMetadata.channelUrl
                //             currentRecipe.recipe_name = recipeName
                //             currentRecipe.recipe = recipe
                //             console.log(currentRecipe)
                //             setRecipes(prevMessages => [...prevMessages.slice(0, -1), currentRecipe])
                //         }
                //     }
                // }
            }
            else {
                if (!(recipe === "no recipes detected")) {
                    // shouldnt this be recipes.at(0) now? and cant i add a third parameter to splice, the recipe?
                    
                    // potential edit START
                    // let recipesString = localStorage.getItem('recipes');
                    // let localRecipes;
                    // if (recipesString) {
                    //     localRecipes =  JSON.parse(recipesString);
                    // }
                    // let currentRecipe = localRecipes.at(0)
                    // if (currentRecipe) {
                    //     currentRecipe.recipe = recipe
                    //     let newlineIndex = recipe.indexOf('\n');
                    //     let recipeIndex = recipe.indexOf(':')
                    //     let recipeName = recipe.substring(recipeIndex + 1, newlineIndex);
                    //     currentRecipe.recipe_name = recipeName
                    //     setRecipes((prevRecipes: Array<any>) => [...prevRecipes.splice(0, 1, currentRecipe)])
                        
                    // }
                    // this didnt fix shit
                    // potential edit END (comment between above, uncomment below)

                    let currentRecipe = recipes.at(-1)
                    console.log(currentRecipe)
                    if (currentRecipe) {
                        currentRecipe.recipe = recipe
                        let newlineIndex = recipe.indexOf('\n');
                        let recipeIndex = recipe.indexOf(':')
                        let recipeName = recipe.substring(recipeIndex + 1, newlineIndex);
                        currentRecipe.recipe_name = recipeName
                        setRecipes((prevRecipes: Array<any>) => [currentRecipe, ...prevRecipes.splice(0, 1)])
                        
                    }

                    // uncomment above
                }
            }
        }
    }

    async function getVideoMetadata(): Promise<any>  {
        // let recipesString = localStorage.getItem('recipes');
        // let localRecipes;
        // if (recipesString) {
        //     localRecipes =  JSON.parse(recipesString);
        // }
        // let currentRecipe = localRecipes.at(0)
        let currentRecipe = recipes[0]  //update to use recipes.at(-1)
        let recipe: string;
        let recipeName: string
        if (chatMessages.length > 0) {
            let potentialRecipes: string[] = []
            for (let messagePair of chatMessages) {
                potentialRecipes.push(messagePair.response.text)
            }
            recipe = findLatestStringWithKeywords(potentialRecipes)
            let newlineIndex = recipe.indexOf('\n');
            let recipeIndex = recipe.indexOf(':')
            recipeName = recipe.substring(recipeIndex + 1, newlineIndex);
            if (!(currentRecipe.channel_name === "")) {
                currentRecipe.recipe_name = recipeName;
                currentRecipe.recipe = recipe;
                return
            }
        }
        
        if (socket && currentRecipe.channel_name === "") {

            const message = JSON.stringify({ action: "getRecipeMetadata", sessionId: sessionId}); 
            socket.send(message);

            socket.onmessage = (event) => {
                let recipeMetadata = JSON.parse(event.data);
                
                if (currentRecipe) {
                    currentRecipe.video_title = recipeMetadata.videoTitle;
                    currentRecipe.url = recipeMetadata.videoURL;
                    currentRecipe.channel_name = recipeMetadata.channelName;
                    currentRecipe.channel_url = recipeMetadata.channelUrl;
                    currentRecipe.recipe_name = recipeName;
                    currentRecipe.recipe = recipe;
                    // setRecipes(prevMessages => [...prevMessages.slice(0, -1), currentRecipe])
                    setRecipes((prevRecipes) => [...prevRecipes])
                    localStorage.setItem('recipes', JSON.stringify(recipes))
                }  
            }
            setIsLoading(false)
        }
    }




    
    async function handleSubmit(event: any) {
        let userInput = (document.getElementById('UserInput') as HTMLTextAreaElement);
        
        event.preventDefault();

        // const newCount = count + 1;
        // setCount(newCount);
        // localStorage.setItem('count', newCount.toString());

        // Set the last reset time if it doesn't exist yet
        if (!localStorage.getItem('lastResetTime')) {
            localStorage.setItem('lastResetTime', new Date().getTime().toString());
        }

        // uncomment these lines of code later on, we need to validate input instead of letting bad input & responses clutter the message history w/ chatgpt,
        // ORRR if the input is invalid, omit it and its response from the history submitted with a chatgpt message request
        let isValidInput = false;
        if (userInput.value.startsWith("https://www.youtube.com/watch?v=") || userInput.value.startsWith("https://www.youtube.com/shorts/") || userInput.value.startsWith("https://youtu.be/") || userInput.value.startsWith("https://m.youtube.com/")) {
            isValidInput = true;
        }

        
        if (chatMessages.length > 0 && isValidInput) {
            setErrorMessage("You already submitted a URL to transcribe, please start a new chat to work on a new video!")
            setOpen(true)
            setInputValue("")
            setIsLoading(false)
            return
        }

        if (chatMessages.length === 0 && !isValidInput) {
            setErrorMessage("Please enter a valid Youtube URL (ex. https://www.youtube.com/watch?v=...)")
            setOpen(true)
            userInput.style.height = "20px"
            userInput.value= ""
            setInputValue("")
            return
        }

        setIsLoading(true)

        let newMessage = {
            request: {
                key: uuidv4(),
                text: ''
            },
            response: {
                key: uuidv4(),
                text: ''
            },
            key: uuidv4()
        }
        if (event.nativeEvent.type === "keydown")  {
            newMessage.request.text = event.target.value;
            if (userInput) {
                userInput.style.height = "20px"
                userInput.value= ""
            }
            if (!chatMessages.includes(newMessage)) {
                setChatMessages((prevMessages: Array<any>) => [...prevMessages, newMessage]);
            }
            let latestResponseDiv = document.getElementById(newMessage.response.key) as HTMLDivElement
            if (latestResponseDiv) {
                latestResponseDiv.scrollIntoView({behavior: 'smooth'});
            }
            if (chatMessages.length === 0) {
                callBackendAPI(newMessage);
            }
            else {
                sendMessage(newMessage)
            }
            

        } else {
            newMessage.request.text = event.target[0].value;
            if (userInput) {
                userInput.style.height = "20px"
                userInput.value= ""
            }
            setInputValue("");
            if (!chatMessages.includes(newMessage)) {
                setChatMessages((prevMessages: Array<any>) => [...prevMessages, newMessage]);
            }
            let latestResponseDiv = document.getElementById(newMessage.response.key) as HTMLDivElement
            if (latestResponseDiv) {
                latestResponseDiv.scrollIntoView({behavior: 'smooth'});
            }
            if (chatMessages.length === 0) {
                callBackendAPI(newMessage);
            }
            else {
                sendMessage(newMessage)
            }
        }
    }

    function handleInput(event: any): void {
        let value = event.target.value;
        let userInput = (document.getElementById('UserInput') as HTMLTextAreaElement);
        if (userInput) {
            userInput.style.height = "0px";
            userInput.style.height = "auto";
            let addedHeight = userInput.scrollHeight
            if (addedHeight > 37) {
                userInput.style.height = (addedHeight*0.99 + 3) + "px"
            } else {
                userInput.style.height = "20px"
            }
            if (userInput.scrollHeight === 37) {
                userInput.style.height = (addedHeight*0.99 + 3) + "px"
            } 
        }
        setInputValue(value);
    }

    async function handleEnter(event: any) {
        let userInput = (document.getElementById('UserInput') as HTMLTextAreaElement);
        if (open === true) {
            userInput.disabled = true;
            setOpen(false)
            setInputValue("");
            userInput.disabled = false;
            await(delay(10))
            userInput.focus();
        }
        let value = event.key;
        let form = (document.getElementById("EntryForm") as HTMLFormElement);
        let input = (document.getElementById("UserInput") as HTMLTextAreaElement);
        let button = (document.getElementById("VisibleButton") as HTMLButtonElement);
        if (form && button) {
            if (value === "Enter" && !event.shiftKey && input.value !== "") {
                handleSubmit(event)
                setInputValue("");
            } 
        }
    }
    
    function toggleSubmitButton() {
        if (!isLoading) {
            if (inputValue === "") {
                return <button className="Button" id="HiddenButton" disabled><CircularProgress sx={{ display: isLoading ? 'block' : 'none' }} id="loadingIcon" color="success" className="CircularProgress"/><SendIcon sx={{ fontSize: 16, color: '#808080', transition: '0.25s' }} /></button> 
            } else {
                return <button className="Button" id="VisibleButton" type="submit"><SendIcon sx={{ fontSize: 16, color: '#91fa91', transition: '0.25s' }} /></button>
            }
        } else {
            return <button className="Button" id="HiddenButton" disabled><CircularProgress sx={{ display: isLoading ? 'block' : 'none' }} id="loadingIcon" color="success" className="CircularProgress"/><SendIcon sx={{ fontSize: 16, color: '#808080', transition: '0.25s' }} /></button>
        }
    }

    async function sendMessage(newMessage: {request: {key: string, text: string}, response: {key: string, text: string}, key: string}): Promise<void> {
        if (socket) {

            let latestMessage = { "role": "user", "content": newMessage.request.text}
            const message = JSON.stringify({ action: "sendMessage", latestMessage: latestMessage, sessionId: sessionId}); 
            socket.send(message);

            socket.onmessage = (event) => {
                let receivedData = event.data;

                if (receivedData === "API_RESPONSE_END") {
                    setIsLoading(false)
                    newRecipe ? setNewRecipe(false) : setNewRecipe(true)
                    return
                }

                let latestMessage = newMessage;

                try {
                    const messages = receivedData.split('\n');
                    for (const message of messages) {
                        if (message === '[DONE]') {
                            // Stream finished
                            setIsLoading(false);
                            return;
                        }
                    }

                    latestMessage.response.text += receivedData;
                
                    if (!chatMessages.includes(receivedData)) {
                        setChatMessages((prevMessages: Array<any>) => [...prevMessages.slice(0, -1), latestMessage]);
                    }

                } catch (error) {
                    console.error('Could not parse WebSocket message', error);
                }
                
            }
            setIsLoading(false)
        }
    }
   
    async function callBackendAPI(newMessage: {request: {key: string, text: string}, response: {key: string, text: string}, key: string}): Promise<void> {
        let countLimit = localStorage.getItem('count');
        let currentCount;
        if (countLimit) {
            currentCount = parseInt(countLimit, 10);
        }

        if (currentCount) {
            if (currentCount > 4) {
                window.alert("Daily transcription limit reached (5). API Limits will increase in the future. Sorry for the inconvenience, please try again tomorrow!")
                setChatMessages([])
                setIsLoading(false)
                return 
            }
            else {
                currentCount += 1;
                let countString = String(currentCount)
                localStorage.setItem('count', countString)
            }
        } 
        
        
        let isFirstMessageReceived = false;
        
        async function processMessage(receivedData: string, latestMessage: {key: string, request: {key: string, text: string}, response: {key: string, text: string}}) {
            let delay = 10;
            
            // Split the operations into two parts
            const eraseMessage = () => {
                return new Promise<void>(resolve => {
                    let currentMessageLength = latestMessage.response.text.length;
                    let finalTimeout = currentMessageLength * delay;
                    for (let i = 0; i < currentMessageLength; i++) {
                        setTimeout(() => {
                            let erasedMessage = latestMessage.response.text.slice(0, -1);
                            latestMessage.response.text = erasedMessage;
                            setChatMessages((prevMessages: Array<any>) => [...prevMessages.slice(0, -1), latestMessage]);
                        }, i * delay/1.7);
                    }
                    // Ensure the promise resolves after all operations
                    setTimeout(resolve, finalTimeout);
                });
            };
        
            const addMessage = () => {
                return new Promise<void>(resolve => {
                    let finalTimeout = receivedData.length * delay;
                    for (let i = 0; i < receivedData.length; i++) {
                        setTimeout(() => {
                            let substring = receivedData.slice(0, i + 1);
                            latestMessage.response.text = substring;
                            setChatMessages((prevMessages: Array<any>) => [...prevMessages.slice(0, -1), latestMessage]);
                        }, i * delay);
                    }
                    // Ensure the promise resolves after all operations
                    setTimeout(resolve, finalTimeout);
                });
            };
        
            await eraseMessage();
            await addMessage();
            if (receivedData === "calling chatgpt...") {
                await eraseMessage();
            }
            latestMessage.response.text = receivedData;
        }
        
        
        
        
        try {
            let lastPromise: Promise<void> = Promise.resolve();
            let queueMessages = true
            if (socket) {
                let message;

                if (sliderValue == "accurate") {
                    message = JSON.stringify({ action: "startWhisperTranscription", url: newMessage.request.text, messageHistory: chatMessages }); 
                }
                else  {
                    message = JSON.stringify({ action: "startTranscription", url: newMessage.request.text, messageHistory: chatMessages }); 
                }
                let sentMessage = JSON.parse(message)
                console.log(sentMessage.action)
                socket.send(message);

                socket.onmessage = (event) => {
                    let receivedData = event.data;

                    if (!isFirstMessageReceived) {
                        setSessionId(receivedData);
                        isFirstMessageReceived = true;
                        return
                    }

                    if (receivedData === "API_RESPONSE_END") {
                        setIsLoading(false)
                        newRecipe ? setNewRecipe(false) : setNewRecipe(true)
                        return
                    }
                    else if (receivedData === "API_RESPONSE_START") {
                        queueMessages = false;
                        let currentMessage = newMessage;
                        currentMessage.response.text = ""
                        setChatMessages((prevMessages: Array<any>) => [...prevMessages.slice(0, -1), currentMessage]);
                        return
                    }

                    

                    
                    let latestMessage = newMessage;

                    try {
                        const messages = receivedData.split('\n');
                        for (const message of messages) {
                            if (message === '[DONE]') {
                                // Stream finished
                                setIsLoading(false);
                                return;
                            }
                        }

                        if (!queueMessages) {
                            latestMessage.response.text += receivedData;
                        }
                        else {
                            lastPromise = lastPromise
                                .then(() => delay(1000))    
                                .then(() => processMessage(receivedData, latestMessage))
                                .catch(error => {
                                    console.error('Error during processing: ', error);
                                });
                            
                            // latestMessage.response.text = receivedData
                        }

                        if (!chatMessages.includes(receivedData)) {
                            setChatMessages((prevMessages: Array<any>) => [...prevMessages.slice(0, -1), latestMessage]);
                        }

                        // if (isScrolledToBottom(chatDiv)) {
                        //     scrollToBottom(chatDiv);
                        // }
                    } catch (error) {
                        console.error('Could not parse WebSocket message', error);
                    }
                }; 
                let recipeExists = recipes.find(recipe => recipe.key === newSessionId);
                if (!recipeExists) {
                    let blankRecipe = {
                        id: uuidv4(),
                        key: uuidv4(),
                        video_title: '',
                        url: '',
                        channel_name: '',
                        channel_url: '',
                        recipe_name: 'New Recipe',
                        recipe: ''
                    }
                    setRecipes((prevRecipes) => [blankRecipe, ...prevRecipes])
                    
                } else {
                }
            }
        } catch (error) {
            console.error('An error occurred during the request', error);
        }
    }

    let placeholder = "Enter a valid YouTube URL"
    if (chatMessages.length > 0) {
        placeholder = "Send a message"
    }

    
    const isScrolledToBottom = (el: any) => {
        const totalScrollableArea = el.scrollHeight - el.clientHeight;
        let bottomThreshold = totalScrollableArea * .09;
        if (el) {
            if (totalScrollableArea < 750) {
                return true
            }
            return el.scrollHeight - el.scrollTop - el.clientHeight < bottomThreshold
        }
        else {
            return false
        }
    }
    

    // This function smoothly scrolls the div to the bottom
    // const scrollToBottom = (div: any) => div.scrollBy({
    //     top: 100000,
    //     behavior: 'smooth'
    // });

    function collapseMenuStyle() {
        return !menu ? (
            <CustomStyledCollapse in={open}>
                <CustomStyledAlert
                    action={
                        <CustomStyledIconButton
                            className="errorIcon"
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                        </CustomStyledIconButton>
                    }
                    icon={false}
                    variant="filled" severity="error"
                    // sx={{ mb: 2, display: 'flex', height: 'auto', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                    >
                    <img className={menu ? "errorImageWithMenu" : "errorImage"} src={`${process.env.PUBLIC_URL}/images/error-alien-head.png`}  />
                    <p className={menu ? "errorMessageWithMenu" : "errorMessage"}>{errorMessage}</p>
                </CustomStyledAlert>
            </CustomStyledCollapse>
        ) : (
            <CustomStyledCollapseWithMenu in={open}>
                <CustomStyledAlertWithMenu
                    action={
                        <CustomStyledIconButtonWithMenu
                            className="errorIcon"
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                            >
                            <CloseIcon fontSize="inherit" />
                        </CustomStyledIconButtonWithMenu>
                    }
                    icon={false}
                    variant="filled" severity="error"
                    // sx={{ mb: 2, display: 'flex', height: 'auto', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                    >
                    <img className={menu ? "errorImageWithMenu" : "errorImage"} src={`${process.env.PUBLIC_URL}/images/error-alien-head.png`}  />
                    <p className={menu ? "errorMessageWithMenu" : "errorMessage"}>{errorMessage}</p>
                </CustomStyledAlertWithMenu>
            </CustomStyledCollapseWithMenu>
        )
    }

    return (
        <> {collapseMenuStyle()}
            <form className='EntryForm' id="EntryForm" onSubmit={handleSubmit}>
                <textarea className="UserInput" id="UserInput" placeholder={placeholder} autoFocus spellCheck="true" wrap="hard" onChange={(event) => handleInput(event)} onKeyDown={(event) => handleEnter(event)}></textarea>
                {toggleSubmitButton()}
            </form>
        </>
    )
}