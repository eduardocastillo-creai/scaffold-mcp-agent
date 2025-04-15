import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, Layout, Typography, Spin } from 'antd';
import { MinusOutlined, MessageOutlined, SendOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const defaultCustomization = {
    colors: { primary: "#000000", text: "#FFFFFF", icon: "#000000" },
    position: { location: "bottom-right", horizontalSpacing: 20, verticalSpacing: 20 },
    dimensions: { width: 470, height: 700 },
    botIcon: {
        shape: "circular",
        roundness: 50,
        imageUrl: "https://s3.amazonaws.com/bucketname/path/to/image.png",
        imageEnabled: true
    }
};

const defaultConfig = {
    greeting: 'Hi, how can I help you?', description: 'AI Assistant', name: 'SalesForce widget', messageDefault: 'Hello'
};

export interface ChatbotProps {
    apiUrl: string;
    chatbotId?: string;
}

interface Message {
    text: string;
    isUser: boolean;
    time?: string;
}

export function Chatbot({ apiUrl, chatbotId }: ChatbotProps): React.ReactElement {
    const params = useParams<{ chatbotId: string }>();
    chatbotId = chatbotId || params?.chatbotId || '0';

    const [inputText, setInputText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isMinimized, setIsMinimized] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([{ text: defaultConfig.greeting, isUser: false }]);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const connectWebsocket = () => {
        const webSocketUrl = "ws://localhost:3000/ws";
        const  newSocket = new WebSocket(webSocketUrl);
        newSocket.onopen = () => {
            // console.log('websocket url', webSocketUrl);
            console.log('Websocket connected');
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const body = data.body;
            // convertir el string a un objeto
            // const response = JSON.parse(body);
            let responseText = body.data.assistantResponse;

            setMessages((prev) => [...prev, { text: responseText,  isUser: false, time: new Date().toLocaleTimeString() }]);
            setIsProcessing(false);
        };

        newSocket.onclose = () => {
            console.log('Websocket closed');
            alert('Websocket closed');
        };

        newSocket.onerror = (error) => {
            console.error('Websocket error:', error);
        };

        setSocket(newSocket);
    }

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        setIsProcessing(true);
        // Añadir mensaje del usuario a la lista de mensajes
        setMessages((prev) => [...prev, { text: inputText, isUser: true, time: new Date().toLocaleTimeString() }]);
        socket?.send(JSON.stringify({ data: { content: inputText } }));
        
        setInputText('');
    };

    useEffect(() => {
        connectWebsocket();
        return () => {
            socket?.close();
        }
    }, []);



    const toggleMinimize = () => setIsMinimized(!isMinimized);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const messageStyle = (isUser: boolean): React.CSSProperties => ({
        backgroundColor: isUser ? '#007bff' : '#f0f0f0',
        color: isUser ? '#fff' : '#000',
        padding: '8px 16px',
        borderRadius: '8px',
        maxWidth: '80%',
        margin: isUser ? '0 0 8px auto' : '0 auto 8px 0',
        textAlign: 'left'
    });

        return (
            <div style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: defaultCustomization.dimensions.width,
                zIndex: 1000,
                display: "flex",
                justifyContent: "flex-end"
            }}>
                {isMinimized ? (
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<MessageOutlined />}
                        size="large"
                        onClick={toggleMinimize}
                        style={{ backgroundColor: defaultCustomization.colors.primary }}
                    />
                ) : (
                    <Layout style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '100%',
                        height: defaultCustomization.dimensions.height
                    }}>
                        <Header style={{
                            backgroundColor: defaultCustomization.colors.primary,
                            color: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text>{defaultConfig.name}</Text>
                            <div>
                                <Button type="link" icon={<SyncOutlined />}
                                        onClick={() => setMessages([{ text: defaultConfig.greeting, isUser: false }])} />
                                <Button type="link" icon={<MinusOutlined />} onClick={toggleMinimize} />
                            </div>
                        </Header>
                        <Content ref={messagesContainerRef}
                                style={{ padding: '16px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={messageStyle(msg.isUser)}>
                                    {msg.isUser ? (
                                        <Text style={{ 
                                                display: "inline-block",
                                                textAlign: "right",
                                                position: "relative",
                                                marginBottom: "8px",
                                                width: "100%",
                                                fontFamily: 'Montserrat, sans-serif'
                                        }} >
                                                {msg.text}
                                            <span 
                                                style={{ 
                                                    display: "block",
                                                    fontSize: "12px",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                {msg.time}
                                            </span>
                                        </Text>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar 
                                                size="small" 
                                                icon={<UserOutlined style={{ fontSize: 16 }} />} 
                                                style={{
                                                    backgroundColor: defaultCustomization.colors.icon,
                                                    marginRight: 8,
                                                    width: 32,
                                                    height: 32,
                                                    flexShrink: 0
                                                }} 
                                            />
                                            <Text
                                                key={idx}
                                                style={{
                                                    display: 'inline-block',
                                                    position: 'relative',
                                                    marginBottom: '8px',
                                                    fontFamily: 'Montserrat, sans-serif' 
                                                }}
                                            >
                                                {msg.text.split('\n').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        <br />
                                                    </React.Fragment>
                                                ))}
                                                { idx > 0 && (
                                                    <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
                                                        {msg.time}
                                                    </span>
                                                )}
                                        </Text>
                                    </div>
                                )}
                                
                            </div> 
                        ))}
                        { isProcessing ? <div><Spin percent='auto' /> </div> : null }
                    </Content>
                    <Footer style={{ padding: '8px 16px', backgroundColor: '#fff', display: 'flex', alignItems: 'center' }}>
                        <Input
                            placeholder="Type your message here..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onPressEnter={handleSendMessage}
                            style={{ marginRight: 8 }}
                            disabled={isProcessing}
                        />
                        <Button type="primary" shape="circle" icon={<SendOutlined />} onClick={handleSendMessage} disabled={isProcessing} />
                    </Footer>
                </Layout>
            )}
        </div>
    );
}