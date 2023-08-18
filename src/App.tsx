import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Fab from '@mui/material/Fab';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState } from 'react';
import { Collapse } from '@mui/material';

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

function App() {
  const [menu, setMenu] = useState(false)
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [chatSessions, setChatSessions] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [appHeaderStyle, setAppHeaderStyle] = useState({ width: '100%'});
  const [fabStyle, setFabStyle] = useState({position: 'absolute', color: 'white', top: 10, left: 10, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'aqua', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#1B1F23', '&:hover': {backgroundColor: '#282c34'}});

  function toggleMenu() {
    if (menu === true) {
      setMenu(false)
      setAppHeaderStyle({ width: '100%'});
      setFabStyle({position: 'absolute', color: 'white', top: 10, left: 10, borderRadius: '20px', borderStyle: 'none', borderWidth: '1px', borderColor: 'aqua', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#282c34', '&:hover': {backgroundColor: '#4A515A'}});
    }
    else {
      setMenu(true)
      setAppHeaderStyle({ width: 'calc(100% - 260px)'});
      setFabStyle({position: 'absolute', color: 'white', top: 10, left: 10, borderRadius: '20px', borderStyle: 'solid', borderWidth: '1px', borderColor: 'aqua', paddingTop: '9px', paddingBottom: '0px', paddingLeft: '1px', boxShadow: 'none', overflow: 'hidden', backgroundColor: '#1B1F23', '&:hover': {backgroundColor: '#282c34'}});
    }
  }
  return (
    <div className="App">
      <Fab id="fab" onClick={toggleMenu} disableRipple size="small" sx={fabStyle}>
          <p className="fabIcon">©</p>
      </Fab>
      <Collapse in={menu}>
        <Sidebar messages={messages} setMessages={setMessages} recipes={recipes} chatSessions={chatSessions} setChatSessions={setChatSessions} currentSessionId={currentSessionId} setCurrentSessionId={setCurrentSessionId}></Sidebar>
      </Collapse>
      <header id="app-header" className="App-header" style={appHeaderStyle}>
        <Chat messages={messages} setMessages={setMessages} recipes={recipes} setRecipes={setRecipes} chatSessions={chatSessions} setChatSessions={setChatSessions} currentSessionId={currentSessionId} setCurrentSessionId={setCurrentSessionId}></Chat>
      </header>
    </div>
  );
}

export default App;
