import { Chatbot, ChatbotProps } from '../Components/Chatbot/Chatbot';
import ReactDOM from 'react-dom/client';
import React from 'react';
import './index.css';

interface MountOptions extends ChatbotProps {
    apiUrl: string;
    chatbotId: string;
}

declare global {
    interface Window {
        Chatbot: {
            mount: (options: MountOptions) => void;
        };
    }
}

window.Chatbot = {
    mount: (options: MountOptions) => {
        const container = document.createElement('div');
        container.id = 'chatbot-container';
        document.body.appendChild(container);

        ReactDOM.createRoot(container).render(
            <React.StrictMode>
                <Chatbot {...options} />
            </React.StrictMode>
        );
    }
};
