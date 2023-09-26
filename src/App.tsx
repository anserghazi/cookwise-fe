import { Auth } from 'aws-amplify';

import { Amplify } from 'aws-amplify';
// import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import { Authenticator, useAuthenticator, View, Button, Image, Text, ThemeProvider, Theme, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-exports';



import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import { Collapse } from '@mui/material';

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { Hub } from 'aws-amplify';

const { v4: uuidv4 } = require('uuid');

class InMemoryStorage {
  private store: { [key: string]: string } = {};

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  getItem(key: string): string | undefined {
    return this.store[key];
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const memoryStore = new InMemoryStorage();

// Modify the awsconfig 
const myConfig: any = {
  ...awsconfig,
  Auth: {
    ...(awsconfig as any).Auth,
    storage: memoryStore  // Here we add our in-memory storage
  }
};

Amplify.configure(myConfig);

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



function App() {
    

  const [menu, setMenu] = useState(true)
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [chatSessions, setChatSessions] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 649)
  const [appHeaderStyle, setAppHeaderStyle] = useState(isMobile && menu ? { width: '0px'} : { width: 'calc(100% - 290px)'});
  const [fabSize, setFabSize]: any = useState(isMobile ? "large" : "small")
  const [fabStyle, setFabStyle] = useState(isMobile ? {position: 'absolute', color: 'white', top: 15, left: 10, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '11px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#060b0f', '&:hover': {backgroundColor: '#060b0f'}}
                                                    : {position: 'absolute', color: 'white', top: 10, left: 10, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '5px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#060b0f', '&:hover': {backgroundColor: '#282c34'}}
  );

  const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
  const [user, setUser] = useState<any | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [clickedAuth, setClickedAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(null)

  const { tokens } = useTheme();

  async function fetchRecipes() {
    // http get request fetch recipes from server
    let response = fetch('https://api.cookwise.app/fetch-recipes', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    return response
    // server endpoint integration is a lambda which fetches all items with userId partition key in the 'recipes' dynamodb table
  }

  // useEffect(() => {
  //   fetch('https://api.cookwise.app/fetch-recipes', {
  //       method: 'GET',
  //       credentials: 'include'
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //       console.log(data)
  //   })
  // }, []);



  function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function clearMemoryStore() {
    memoryStore.clear();
  }

  function getMemoryStoreItem(key: string) {
    return memoryStore.getItem(key)
  }

  useEffect(() => {
    fetch('https://api.cookwise.app/validate-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.email) {
          memoryStore.setItem("email", data.email)
        }
        setIsAuthenticated(true);
        checkUser();
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (isMobile) {
      if (menu) {
        setAppHeaderStyle({ width: '0px'})
        setFabStyle({position: 'absolute', color: 'white', top: 15, left: 10, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '11px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#111418', '&:hover': {backgroundColor: '#111418'}})
      }
      setFabSize("large")
    }
    else {
      if (menu) {
        setAppHeaderStyle({ width: 'calc(100% - 290px)'})
        setFabStyle({position: 'absolute', color: 'white', top: 10, left: 237, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#111418', '&:hover': {backgroundColor: '#282c34'}})
      }
      setFabSize("small")
    }
  }, [isMobile])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 649);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let isGuestString = localStorage.getItem('isGuest');
    let isGuest = (isGuestString === 'true');
    setIsGuest(isGuest)
  }, []);

  useEffect(() => {
    let isMenuString = localStorage.getItem('menu');
    let isMenu = (isMenuString === 'true');
    if (!isMenu === menu) {
      toggleMenu()
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const listener = (data: any) => {
      switch (data.payload.event) {
        case 'signIn':
          const authenticationActions = async () => {
            try {
              await checkUser();
              if (isCancelled) return;
              let serverRecipes = await fetchRecipes();
              
              for (let i = 0; i < serverRecipes.length; i++) {
                serverRecipes[i].id = serverRecipes[i].uuid;
                serverRecipes[i].key = uuidv4();
                serverRecipes[i].recipe_name = serverRecipes[i].recipeName;
                serverRecipes[i].recipe = serverRecipes[i].recipeText;
                serverRecipes[i].video_title = serverRecipes[i].videoTitle;
                // serverRecipes[i].url = serverRecipes[i].url;
                serverRecipes[i].channel_name = serverRecipes[i].channelName;
                serverRecipes[i].channel_url = serverRecipes[i].channelUrl;

                delete serverRecipes[i].uuid;
                delete serverRecipes[i].recipeName;
                delete serverRecipes[i].recipeText;
                delete serverRecipes[i].videoTitle;
                // delete serverRecipes[i].url;
                delete serverRecipes[i].channelName;
                delete serverRecipes[i].channelUrl;
              }

              localStorage.setItem("recipes", JSON.stringify(serverRecipes)) // but dont delete existing recipes, just add them to this list, next authentication theyll be pulled from server (also figure out how to handle guest added ones)
              
              setRecipes(serverRecipes)
            } catch (err) {
                // Handle or report the error appropriately
            }
          }
          authenticationActions();
          break;
        case 'signOut':
          if (!isCancelled) {
            setIsAuthenticated(false);
          }
          setIsAuthenticated(false);
          break;
        default:
          break;
      }
    };

    Hub.listen('auth', listener);
    
    return () => {
        isCancelled = true; // Mark the component as unmounted
        Hub.remove('auth', listener);
    }; // Clean up the listener when component unmounts
  }, []);

  useEffect(() => {
      checkUser();
  }, [isAuthenticated]);

  useEffect(() => {
  }, [user]);

  async function checkUser() {
      try {
          let jwtToken;
          let email = memoryStore.getItem("email")
          if (email) {
            // await fetch('https://api.cookwise.app/set-cookie', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${jwtToken}`
            //   },
            //   credentials: 'include'
            // });

            setUser({
              email: email
            })
            setIsAuthenticated(true);
            setClickedAuth(false)
            setIsLoading(false)
            return
          }
          const userData = await Auth.currentAuthenticatedUser();
          
          jwtToken = userData.signInUserSession.idToken.jwtToken;
          
          await fetch('https://api.cookwise.app/set-cookie', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${jwtToken}`,
                  'Content-Type': 'application/json'
              },
              credentials: 'include'
          });
          

          const userAttributes = userData.attributes
          setUser(userAttributes);
          setIsAuthenticated(true);
          setClickedAuth(false)
      } catch (error) {
          setIsAuthenticated(false);
          await sleep(1000)
          setIsLoading(false)
      }
  }

  const handleGuestAccess = () => {
    setIsGuest(true);
    setClickedAuth(false);
    localStorage.setItem('isGuest', 'true');
  };

  const theme: Theme = {
    name: 'Auth Example Theme',
    tokens: {
      colors: {
        background: {
          primary: {
            value: "#1B1F23",
          },
          secondary: {
            value: "#060b0f",
          },
          tertiary: {
            value: tokens.colors.neutral['10'].value,
          }
        },
        font: {
          primary: {
            value: "white"
          },
          secondary: {
            value: "white"
          },
          tertiary: {
            value: "white"
          },
          interactive: {
            value: "white",
          },
          focus: {
            value: "white",
          },
          hover: {
            value: "white",
          },
          active: {
            value: "white",
          }
        }
      },
      components: {
        tabs: {
          borderColor: { value: '#383E4C' },
          item: {
            borderColor: { value: '#383E4C' },
            borderWidth: { value: "3px" },
            color: { value: '#9598A1' },
          }
        }
      }
    },
  }

  const components = {
    Header() {
      return (
        <View textAlign="center">
          <Text style={{fontFamily: "Fredericka the Great", fontSize: "150px", fontWeight: '500', color: 'white', margin: '-10px 0px -45px 0px'}}>©</Text>
          {/* <Text style={{fontFamily: "Fredericka the Great", fontSize: "60px", fontWeight: '500', color: 'white', margin: '40px 0px 20px 0px'}}>Cookwise</Text> */}
        </View>
      )
    },
    SignIn: {
      Footer() {
        const { toResetPassword } = useAuthenticator();
        return (
          <>
            <View className='guestLoginView' textAlign="center" margin="-20px 0px 0px 0px" display="flex">
              <View className="centerButton" display="flex">
                <Button
                  display="flex"
                  className='guestLoginButton'
                  onClick={handleGuestAccess} 
                  fontWeight="bold"
                  fontSize="16px"
                  margin="1px 0px 0px 0px"
                  variation='primary'
                  height="6vh"
                  isFullWidth={true}>Continue as Guest
                </Button>
              </View>
            </View>
            <View textAlign="center" margin="6px 0px 20px 0px">
              <Button
                className='forgotPasswordButton'
                fontWeight="bold"
                onClick={toResetPassword}
                size="small"
                variation='link'
              >
                Forgot your password?
              </Button>
            </View> 
          </>
        )
      }
    }
  }


  
  
 

  // function redirectToSignIn() {
  //   Auth.federatedSignIn(); // This will redirect the user to the Amplify hosted sign-in page
  // }
  
  function toggleMenu() {
    setOpenDialog(null)
    let recipeList = document.getElementsByClassName('recipeList')[0];
    let targetElement = recipeList?.querySelector('.clickedFadeOverlay');
    targetElement?.classList.remove('clickedFadeOverlay');
    if (menu === true) {
      setMenu(false)
      setAppHeaderStyle({ width: '100%'});
      if (isMobile) {
        setFabStyle({position: 'absolute', color: 'white', top: 15, left: 10, borderRadius: '20px', borderStyle: 'none', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '11px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#060b0f', '&:hover': {backgroundColor: '#060b0f'}});
      }
      else {
        setFabStyle({position: 'absolute', color: 'white', top: 10, left: 10, borderRadius: '20px', borderStyle: 'none', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#060b0f', '&:hover': {backgroundColor: '#4A515A'}});
      }
      localStorage.setItem('menu', 'false');
    }
    else {
      setMenu(true)
      if (window.innerWidth > 650) {
        setAppHeaderStyle({ width: 'calc(100% - 290px)'});
      }
      else {
        setAppHeaderStyle({ width: '0px'});
      }
      
      if (isMobile) {
        setFabStyle({position: 'absolute', color: 'white', top: 15, left: 10, borderRadius: '10px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '11px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#111418', '&:hover': {backgroundColor: '#111418'}});
      }
      else {
        setFabStyle({position: 'absolute', color: 'white', top: 10, left: 237, borderRadius: '5px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgb(0, 68, 68)', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#111418', '&:hover': {backgroundColor: '#282c34'}});
      }
      localStorage.setItem('menu', 'true');
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ position: 'fixed',top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <CircularProgress color='success' size={75}/>
      </Box>
    )
  }
  return ((isAuthenticated || isGuest) && !clickedAuth) ? (
    <div className="App">
      {/* <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button> */}
      <Fab id="fab" onClick={toggleMenu} disableRipple size={fabSize} sx={fabStyle}>
          <p className="fabIcon">©</p>
      </Fab>
      <Collapse in={menu}>
        <Sidebar menu={menu} messages={messages} setMessages={setMessages} recipes={recipes} setRecipes={setRecipes} chatSessions={chatSessions} setChatSessions={setChatSessions} currentSessionId={currentSessionId} setCurrentSessionId={setCurrentSessionId} user={user} setUser={setUser} clickedAuth={clickedAuth} setClickedAuth={setClickedAuth} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isGuest={isGuest} setIsGuest={setIsGuest} isMobile={isMobile} toggleMenu={toggleMenu} memoryStore={memoryStore} getMemoryStoreItem={getMemoryStoreItem} clearMemoryStore={clearMemoryStore} openDialog={openDialog} setOpenDialog={setOpenDialog}></Sidebar>
      </Collapse>
      <header id="app-header" className="App-header" style={appHeaderStyle}>
        <Chat menu={menu} messages={messages} setMessages={setMessages} recipes={recipes} setRecipes={setRecipes} chatSessions={chatSessions} setChatSessions={setChatSessions} currentSessionId={currentSessionId} setCurrentSessionId={setCurrentSessionId}></Chat>
      </header>
    </div>
  ) : (
    <ThemeProvider theme={theme}>
      <Authenticator components={components}/>
    </ThemeProvider>
  );
}

export default App;
