import { useState, useRef, RefObject } from 'react';
import './Recipe.css';
import { Dialog } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
    left: '290px',
    [theme.breakpoints.down(750)]: {
        left: '0px',
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'hsl(214, 100%, 34%, 0.4)',
      width: 'calc(100% - 290px)',
      left: '290px',
      [theme.breakpoints.down(750)]: {
        left: '0px',
        width: '100'
      }
    },
    '& .MuiPaper-root': {
      marginLeft: '10px',
      marginRight: '10px',
      padding: '0px 0px 0px 0px',
      color: 'white',
      backgroundColor: '#1B1F23',
      fullScreen: true,
      width: '95%',
      maxWidth: '100%',
      [theme.breakpoints.down(750)]: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        marginLeft: '0vw', // or any desired value for small screens
        maxWidth: '100vw',
        marginRight: '0px',
        paddingRight: '0px'
      }
    }
  }));

export default function Recipe({menu, id, key, videoUrl, videoTitle, channelUrl, channelName, recipeName, recipe, openDialog, setOpenDialog, handleDelete}: {menu: any, id: string, key: string, videoUrl: string, videoTitle: string, channelUrl: string, channelName: string, recipeName: string, recipe: string, openDialog: any, setOpenDialog: any, handleDelete: any}) {
    const [dialog, setDialog] = useState(false)
    const [clickedStyle, setClickedStyle] = useState('recipe')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const recipeText: RefObject<HTMLParagraphElement> = useRef(null);

    const [copyIconStyle, setCopyIconStyle] = useState('')
    const [deleteIconStyle, setDeleteIconStyle] = useState('')

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down(750));

    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

    let newLineIndex = recipe.indexOf('\n\n')
    let instructionsIndex = recipe.indexOf('\nInstructions:')
    let tipsIndex = recipe.indexOf('\nTips:')
    let ingredients = recipe.slice(newLineIndex + 15, instructionsIndex)
    let instructions = recipe.slice(instructionsIndex + 15, tipsIndex + 1).replace(/\n\n/g, '\n');
    let modalInstructions = recipe.slice(instructionsIndex + 15, tipsIndex + 1).replace('\nTips:', '\n\nTips:');
    let tips = recipe.slice(tipsIndex + 7, recipe.length)
    let recipeWithoutTitle = recipe.slice(newLineIndex + 2, recipe.length)
    let fadeOverlayComponent = document.getElementById(`fadeOverlay${id}`)
    function checkStyle() {
        if (id === openDialog) {
            return 'clickedRecipe'
        }
        else {
            return 'recipe'
        }
        
    }


    function toggleModal(event: any) {
        event.stopPropagation()
        let recipeList = document.getElementsByClassName('recipeList')[0];
        let targetElement = recipeList.querySelector('.clickedFadeOverlay');
        targetElement?.classList.remove('clickedFadeOverlay');
        // delay(100)
        if (!openDialog) {
            setOpenDialog(id)
            setClickedStyle('clickedRecipe')
            fadeOverlayComponent?.classList.add('clickedFadeOverlay')
        }
        else {
            if (id === openDialog) {
                setOpenDialog(null)
                setClickedStyle('recipe')
                // fadeOverlayComponent?.classList.remove('clickedFadeOverlay')
            }
            else {
                setOpenDialog(id)
                setClickedStyle('clickedRecipe')
                let fadeOverlayComponent = document.getElementById(`fadeOverlay${id}`)
                fadeOverlayComponent?.classList.add('clickedFadeOverlay')
            }
            
        }
       
        // if (!openDialog) {
        //     setOpenDialog(event.target.id)
        // }
        // if (dialog === false) {
        //     setDialog(true)
        //     setClickedStyle('clickedRecipe')
        // }
        // else {
        //     setDialog(false)
        //     setClickedStyle('recipe')
        // }
    }

    function handleClose() {
        setDialog(false)
        setOpenDialog(null)
        fadeOverlayComponent?.classList.remove('clickedFadeOverlay')
        // if (openDialog) {
        //     setOpenDialog(null)
        // }
        // setDialog(false)
        // setClickedStyle('recipe')
    }

    async function copyToClipboard() {
        setCopyIconStyle('copyIcon')
        await delay(200)
        setCopyIconStyle('')
        if (navigator.clipboard && recipeText.current) {
            navigator.clipboard.writeText(recipeText.current.innerText)
            .then(() => {
                
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }

    function showDelete(event: any) {
        event.stopPropagation()
        setDialog(true)
        setOpenDialog(id)
    }

    function closeDelete(event: any) {
        event.stopPropagation()
        setDialog(false)
        
    }
   
    function processDelete() {
        handleDelete(id);
        setDialog(false)
        setOpenDialog(null)
    }

    function stopEventPropagation(event: any) {
        event.stopPropagation()
    }

    function displayRecipeName() {
        if (recipeName.length < 36) {
            return recipeName;
        }
        else {
            return recipeName.substring(0, 35);
        }
    }

    return (
        <>  
            <div className={checkStyle()} onClick={toggleModal}>
                {/* <ReceiptLongIcon sx={{fontSize: '20px', fontWeight: '100', display: 'inline', marginLeft: '-5px'}}></ReceiptLongIcon> */}
                    <p id={id} className='sidebarRecipe'>{displayRecipeName()}<div id={`fadeOverlay${id}`} className="fadeOverlay"></div>{openDialog === id && <DeleteOutlineIcon onClick={showDelete} sx={{ color: 'grey', fontSize: '1.7em', position: 'absolute', top: -2, right: 3, marginRight: '3px', marginLeft: '10px', '&:hover': { color: 'white'}, '&:active': { transform: 'rotate(-10deg)', color: 'black' }}}></DeleteOutlineIcon>}</p>
                
                <StyledDialog onClose={handleClose} open={openDialog === id} fullScreen={isSmallScreen} transitionDuration={0} onClick={stopEventPropagation}>
                    <div style={{height: 'inherit', overflowY: 'hidden', margin: '0px 0px 0px 0px', padding: "0px 0px 0px 0px", backgroundColor: "#1B1F23", borderRadius: "5px", display: 'flex', flexFlow: 'column nowrap'}}>
                        <div className="recipeHeaderDiv" style={{display: 'flex', flexDirection: 'column'}}>
                            <div className="recipeHeader" style={{flexDirection: 'row'}}>
                                <p className='recipeTitle'>{recipeName}</p>
                                <ContentCopyIcon onClick={copyToClipboard} className={copyIconStyle} sx={{ color: '#383E4C', fontSize: '2em', display: 'flex', margin: '5px 0px 0px 8px', padding: '0px 0px 0px 0px', '&:hover': { color: 'white'}}}></ContentCopyIcon>
                                <CloseIcon onClick={handleClose} className={deleteIconStyle} sx={{ color: '#383E4C', fontSize: '2.5em', display: 'flex', margin: '0px 5px 0px 0px', padding: '0px 0px 0px 0px', marginLeft: 'auto', '&:hover': { color: 'white'}}}></CloseIcon>
                            </div>
                            <p style={{ marginTop: '0px', fontSize: '13px'}}>Original Video: <a href={videoUrl} target='_blank'>{videoTitle}</a></p>
                            <p style={{ marginTop: '0px', fontSize: '13px'}}>YouTube Channel: <a href={channelUrl} target='_blank'>{channelName}</a></p>
                        </div>
                        <div className="recipeContentDiv">
                            <div className='recipeSubheaderContainer'>   
                                <p className="recipeSubheader" style={{width: '33%', marginLeft: '15px'}}>Ingredients</p>
                                <p className="recipeSubheader" style={{width: '67%'}}>Instructions</p>
                            </div>
                            <div className='recipeTextContainer'>
                                <p className='recipeText' id="ingredients" ref={recipeText}>{ingredients}</p>
                                <p className='recipeText' id="instructions" ref={recipeText}>{modalInstructions}<p className="recipeSubheader">Tips:</p>{tips}</p>
                            </div>
                        </div>
                        
                    </div>
                </StyledDialog>
                
            </div>
            <Dialog onClick={stopEventPropagation} onClose={closeDelete} open={dialog} transitionDuration={0} fullScreen={isSmallScreen} style={{left: '290px'}} PaperProps={{sx:{backgroundColor: "#1B1F23", borderRadius: "10px"}}}>
                <div className="closeDialog">
                    <p style={{fontSize: '30px', width: '100%', fontWeight: '300'}}>Delete Recipe?</p>
                    <p>{recipeName}</p>
                    <img style={{height: '55%', width: 'auto', position: 'absolute', right: 25, top: 16}} src={`${process.env.PUBLIC_URL}/images/inquisitive-alien-head.png`}  />
                    <button className="cancelButton" onClick={closeDelete}>Cancel</button>
                    <button className="deleteButton" onClick={processDelete}>Delete</button>
                </div>
            </Dialog>
        </>
    )   
}