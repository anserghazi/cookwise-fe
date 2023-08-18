import { useState, useRef, RefObject } from 'react';
import './Recipe.css';
import { Dialog } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface IRecipe {
    key: string,
    url: string,
    video_title: string,
    channel_name: string,
    channel_url: string,
    recipe_name: string,
    recipe: string
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    fontFamily: "'Noto Serif Georgian', sans-serif",
    fontWeight: 300,
    
    '& .MuiBackdrop-root': {
      backgroundColor: 'hsl(250, 100%, 50%, 0.08)',
      width: 'calc(100% - 260px)',
      left: '260px'
    },
    '& .MuiPaper-root': {
      marginLeft: 'calc(260px + 1%)',
      marginRight: '10px',
      padding: '0px 10px 0px 10px',
      color: 'white',
      backgroundColor: '#1B1F23',
      fullScreen: true,
      maxWidth: 'calc(90% - 260px)',
      [theme.breakpoints.down(750)]: {
        marginLeft: '0vw', // or any desired value for small screens
        maxWidth: '100vw',
        marginRight: '0px',
        paddingRight: '0px'
      }
    }
  }));

export default function Recipe({key, videoUrl, videoTitle, channelUrl, channelName, recipeName, recipe}: {key: string, videoUrl: string, videoTitle: string, channelUrl: string, channelName: string, recipeName: string, recipe: string}) {
    const [dialog, setDialog] = useState(false)
    const [clickedStyle, setClickedStyle] = useState('recipe')
    const recipeText: RefObject<HTMLParagraphElement> = useRef(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(750));

    let newLineIndex = recipe.indexOf('\n\n')
    let recipeWithoutTitle = recipe.slice(newLineIndex + 2, recipe.length)


    function openModal() {
        if (dialog === false) {
            setDialog(true)
            setClickedStyle('clickedRecipe')
        }
    }

    function handleClose() {
        setDialog(false)
        setClickedStyle('recipe')
    }

    function copyToClipboard() {
        if (navigator.clipboard && recipeText.current) {
            navigator.clipboard.writeText(recipeText.current.innerText)
            .then(() => {
                console.log('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }
    
    return (
        <div id='recipe' className={clickedStyle} onClick={openModal}>
            {/* <ReceiptLongIcon sx={{fontSize: '20px', fontWeight: '100', display: 'inline', marginLeft: '-5px'}}></ReceiptLongIcon> */}
            <p className='sidebarRecipe'>{recipeName}</p>
            
            <StyledDialog open={dialog} onClose={handleClose} fullScreen={isSmallScreen}>
                <div style={{overflowY: 'auto', margin: '15px 0px 10px 0px', padding: "0px 20px 0px 10px", backgroundColor: "#1B1F23", borderRadius: "5px"}}>
                    <CloseIcon onClick={handleClose} sx={{ color: '#383E4C', fontSize: '2.5em', float: 'right', marginTop: '1px', marginRight: '-15px', '&:hover': { color: 'white'}, '&:active': { color: 'red' }}}></CloseIcon>
                    <ContentCopyIcon onClick={copyToClipboard} sx={{ color: '#383E4C', fontSize: '2em', float: 'right', marginTop: '5px', marginRight: '2px', marginLeft: '10px', '&:hover': { color: 'white'}, '&:active': { transform: 'rotate(-10deg)', color: 'green' }}}></ContentCopyIcon>
                    <p className='recipeHeader'>{recipeName}</p>
                    <p style={{ marginTop: '10px'}}>Original Video: <a href={videoUrl} target='_blank'>{videoTitle}</a></p>
                    <p>YouTube Channel: <a href={channelUrl} target='_blank'>{channelName}</a></p>
                    <p className='recipeText' ref={recipeText}>{recipeWithoutTitle}</p>
                </div>
            </StyledDialog>
        </div>
    )   
}