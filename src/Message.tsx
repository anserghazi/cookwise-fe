import './Message.css';
import Avatar from '@mui/material/Avatar';
import RestaurantMenuTwoToneIcon from '@mui/icons-material/RestaurantMenuTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';

interface IMessage {
    request: {
        key: string,
        text: string,
        id: string
    },
    response: {
        key: string,
        text: string,
        id: string
    }
}

export default function Message({request, response}: {request: any, response: any}) {
    return (
        <>
            <div className="MessageRequest" key={request.key} id={request.key}>
                <Avatar className="Avatar" key={"avatar" + request.key} variant="square" sx={{ backgroundColor: "#005757", maxHeight: 25, maxWidth: 25, minHeight: 25, minWidth: 25, borderRadius: 1 }}>
                    <SupportAgentTwoToneIcon key={"icon" + request.key} sx={{ fontSize: 23, color: '#60FF6A' }} />
                </Avatar>
                <p className="MessageParagraph" id={"p" + request.key}>{request.text}</p>
            </div>
            <div className="MessageResponse" key={response.key} id={response.key}>
                <Avatar className="Avatar" key={"avatar" + response.key} variant="square" sx={{ backgroundColor: "#DC0101", maxHeight: 25, maxWidth: 25, minHeight: 25, minWidth: 25, borderRadius: 1 }}>
                    <RestaurantMenuTwoToneIcon  key={"icon" + response.key} sx={{ fontSize: 25, color: '#5C0505' }} />
                </Avatar>
                <p className="MessageParagraph" id={"p" + response.key}>{response.text}</p>
            </div>
        </>
    )   
}