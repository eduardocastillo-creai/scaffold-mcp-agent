import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { Route } from 'react-router-dom';
import { App } from './Components/app/App';
import React, { lazy, Suspense } from 'react';
import * as serviceWorker from './serviceWorker';

const Home = lazy(() => import('./Components/Home/Home').then(({ Home }) => ({ default: Home })));
const Chatbot = lazy(() => import('./Components/Chatbot/Chatbot').then(({ Chatbot }) => ({ default: Chatbot })));

const container: any = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <Suspense>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: '#1f2023',
                        algorithm: true,
                    },
                },
            }}
        >
            <App>
                <Route path="/" element={<Chatbot apiUrl={'wss://stage-vensure-aiassistant-webPubSub.webpubsub.azure.com/client/hubs/Hub'} />} />
                <Route
                    path="chat/:chatbotId"
                    element={
                        <Chatbot apiUrl={'https://aiassistantvensure.azurewebsites.net/api/getMessage'} />
                    }
                />
            </App>
        </ConfigProvider>
    </Suspense>
);

serviceWorker.unregister();
