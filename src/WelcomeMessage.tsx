import { useEffect } from 'react';
import './WelcomeMessage.css'

export default function WelcomeMessage({setSliderValue}: {setSliderValue: any}) {

   
    useEffect(() => {
        let transcriptionModeToggleSwitch = document.getElementById("transcriptionModeToggleSwitch") as HTMLInputElement;
        if (transcriptionModeToggleSwitch) {
            transcriptionModeToggleSwitch.addEventListener('change', function() {
                if (this.checked) {
                    setSliderValue("accurate");
                } else {
                    setSliderValue("rapid");
                }
              });
        }
    }, []);

    return (
        <div className='welcome-container'>
            <div className='welcome-message'>
                <div className='welcome-column'>
                    <h1 className="cookwise-header">Cookwise</h1>
                    <p className='welcome-p'>Welcome to Cookwise! Begin by entering the URL of any YouTube cooking video.
                    </p>
                </div>
                <div className='row-examples'>
                    <div>"Can you make this recipe vegan?"</div>
                    <div>"I don't have a charcoal grill, can you alter the recipe so it uses an oven instead?"</div>
                    <div style={{fontSize: '13px', alignItems: 'center', justifyContent: 'center'}}>Transcription modes: <p style={{marginLeft: '.5%', color: '#267426', lineHeight: 1.2, fontWeight: 500}}>Rapid</p> | <p style={{color: '#2196F3', lineHeight: 1.2, fontWeight: 500, marginRight: '2px'}}>Accurate (any language)</p></div>
                </div> 
                <div className='row-examples' style={{marginTop: '4%'}}>
                    <label className="switch">
                        <input type="checkbox" id="transcriptionModeToggleSwitch"/>
                        <span className="slider"></span>
                    </label>        
                </div>   
            </div>
        </div>
    )
}