import './WelcomeMessage.css'

export default function WelcomeMessage() {

    return (
        <div className='welcome-container'>
            <div className='welcome-message'>
                <div className='welcome-column'>
                    <h1 className="cookwise-header">Cookwise</h1>
                    <p className='welcome-p'>Welcome to Cookwise! Begin by entering the URL of any YouTube cooking video.
                        Cookwise will generate an accurate recipe using the video transcription, 
                        and using ChatGPT, Cookwise can alter the recipe to your liking!
                    </p>
                </div>
                <div className='row-examples'>
                    <div>"https://www.youtube.com/watch?v=fbNd3e8c8Ns"</div>
                    <div>"Can you make this recipe vegan?"</div>
                    <div>"I don't have a charcoal grill, can you alter the recipe so it uses an oven instead?"</div>
                </div>            
            </div>
        </div>
    )
}