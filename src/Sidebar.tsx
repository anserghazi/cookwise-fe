import './Sidebar.css';
import Recipe from './Recipe'
import { useState, useEffect } from 'react';

import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Dialog } from '@mui/material';
Auth.configure(awsconfig);

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
    id: string,
    key: string,
    url: string,
    video_title: string,
    channel_name: string,
    channel_url: string,
    recipe_name: string,
    recipe: string
}

type CognitoUser = {
    username: string;
    signInUserSession: {
        idToken: {
            jwtToken: string;
        };
        accessToken: {
            jwtToken: string;
        };
        refreshToken: {
            token: string;
        };
    };
};
  

export default function Sidebar({menu, messages, setMessages, recipes, setRecipes, chatSessions, setChatSessions, currentSessionId, setCurrentSessionId, user, setUser, clickedAuth, setClickedAuth, isAuthenticated, setIsAuthenticated, isGuest, setIsGuest, isMobile, toggleMenu, memoryStore, getMemoryStoreItem, clearMemoryStore, openDialog, setOpenDialog}: {menu: any, messages: Array<IMessage>, setMessages: React.Dispatch<React.SetStateAction<Array<IMessage>>>, recipes: Array<IRecipe>, setRecipes: React.Dispatch<React.SetStateAction<Array<IRecipe>>>, chatSessions: Array<string>, setChatSessions: React.Dispatch<React.SetStateAction<Array<string>>>, currentSessionId: string, setCurrentSessionId: React.Dispatch<React.SetStateAction<string>>, user: null | any, setUser: React.Dispatch<React.SetStateAction<null | any>>, clickedAuth: boolean, setClickedAuth: React.Dispatch<React.SetStateAction<boolean>>, isAuthenticated: boolean, setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>, isGuest: boolean, setIsGuest: React.Dispatch<React.SetStateAction<boolean>>, isMobile: boolean, toggleMenu: any, memoryStore: any, getMemoryStoreItem: any, clearMemoryStore: any, openDialog: any, setOpenDialog: any}) {
    const [clearChat, setClearChat] = useState(false);
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

    useEffect(() => {
        setMessages([])
        let newSessionId = uuidv4();
        setCurrentSessionId(newSessionId)
        setChatSessions((prevSessions) => [...prevSessions, currentSessionId])
    }, [clearChat])


    function allRecipes() {
        let Recipes = recipes.map((recipe: { id: string, key: string, url: string, video_title: string, channel_name: string, channel_url: string, recipe_name: string, recipe: string}) => { 
            return <Recipe menu={menu} id={recipe.id} key={recipe.key} videoUrl={recipe.url} videoTitle={recipe.video_title} channelUrl={recipe.channel_url} channelName={recipe.channel_name} recipeName={recipe.recipe_name} recipe={recipe.recipe} openDialog={openDialog} setOpenDialog={setOpenDialog} handleDelete={handleDelete} isMobile={isMobile}></Recipe>
        })
        if (recipes.length > 0) {
            return Recipes
        }
        else {
            return (
                <div className='welcomeSidebarDiv'>
                    <p id='welcomeSidebar'>(Your recipes will show up here)</p>
                </div>
            )
        }
        
    }

    function onDelete(id: any) {
        // Show an alert to the user
        // const userConfirmation = window.confirm("Are you sure you want to delete this recipe?");
    
        // if (userConfirmation) {
        //     // If the user clicks "OK", send the deletion request
        //     handleDelete(id);
        // } else {
        //     // If the user clicks "Cancel", do nothing
        //     console.log("Deletion cancelled by user");
        // }
    }

    function handleDelete(id: any) {
        let recipesString = localStorage.getItem('recipes');
        if (recipesString) {
            let localRecipes =  JSON.parse(recipesString);
            for (let i = 0; i < localRecipes.length; i++) {
                if (localRecipes[i].id === id) {
                    localRecipes.splice(i, 1);
                    break;  // Exit the loop after deleting the first match
                }
            }
            localStorage.setItem('recipes', JSON.stringify(localRecipes))
            setRecipes(localRecipes)
        }
        fetch('https://api.cookwise.app/delete-recipe', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ id: id })
        })
    }

    function newChat() {
        clearChat ? setClearChat(false) : setClearChat(true)
        if (isMobile) {
            toggleMenu()
        }
        setOpenDialog(null)
    }

    const handleSignOut = async () => {
        try {
            await fetch('https://api.cookwise.app/sign-out', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });
            await Auth.signOut();
            clearMemoryStore();
            localStorage.setItem("recipes", "[]")
            setUser(null)
            setIsAuthenticated(false)
        } catch (error) {
            console.error('Error signing out user', error);
        }
    };

    function navigateToAuthenticator() {
        setClickedAuth(true)
        setIsGuest(false)
        localStorage.setItem('isGuest', 'false')
    }

    function exitDialog() {
        let recipeList = document.getElementsByClassName('recipeList')[0];
        let targetElement = recipeList.querySelector('.clickedFadeOverlay');
        targetElement?.classList.remove('clickedFadeOverlay');
        setOpenDialog(null)
    }

    function showDeleteAccount(event: any) {
        // event.stopPropagation()
        setDeleteAccountDialog(true)
    }

    function closeDeleteAccount(event: any) {
        // event.stopPropagation()
        setDeleteAccountDialog(false)
        
    }

    function deleteAccount() {
        window.alert('your account has been deleted')
    }
    
    return user ? (
        <div className="sidebar" onClick={exitDialog}>
            <button className='newChat' onClick={newChat}>New Chat</button>
            <div className='recipeList'>
                {allRecipes()}
            </div>
            <div className='userLogin'>
                <button className='authenticationButton' onClick={handleSignOut}>Sign Out</button>
            </div>
            <p id='username' onClick={showDeleteAccount}>Signed in as {user.email}</p>
            <Dialog onClose={closeDeleteAccount} open={deleteAccountDialog} transitionDuration={0} style={{left: '290px'}} PaperProps={{sx:{backgroundColor: "#1B1F23", borderRadius: "10px"}}}>
                <div className="closeDialog">
                    <p style={{fontSize: '30px', width: '100%', fontWeight: '300'}}>Delete account?</p>
                    <p>{user.email}</p>
                    <img style={{height: '55%', width: 'auto', position: 'absolute', right: 25, top: 16}} src={`${process.env.PUBLIC_URL}/images/crying-alien-head.png`}  />
                    <button className="cancelButton" onClick={closeDeleteAccount}>Cancel</button>
                    <button className="deleteButton" onClick={deleteAccount}>Delete</button>
                </div>
            </Dialog>
        </div>
    ) : (
        <div className="sidebar">
            <button className='newChat' onClick={newChat}>New Chat</button>
            <div className='recipeList'>
                {allRecipes()}
            </div>
            <div className='userLogin'>
                <button onClick={navigateToAuthenticator} className='authenticationButton'>Log In / Sign Up</button> 
            </div>
            <p id='guest'>Sign in to save your recipes</p>
            <a style={menu ? {fontSize: '6px', width: '25%', position: 'absolute', bottom: '0', right: '0', marginRight: '10px', color: '#757D87', display: 'inline', marginBottom: '5px'} : {display: 'none'}} href="https://www.flaticon.com/free-icons/alien-head" title="alien head icons">Icons from Freepik Flaticon</a>
        </div>
    )

}