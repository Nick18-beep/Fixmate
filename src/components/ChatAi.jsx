import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import { GoogleGenerativeAI } from "@google/generative-ai";


const API_KEY = "AIzaSyD0lkbGI285rAoyCIzQ5GMj6ut3oxfvBAY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatAi = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Resetta la chat al caricamento iniziale
  useEffect(() => {
    setMessages([
      {
        message: "Hello, I'm Gemini AI! I am here to help you with chess!",
        sentTime: "just now",
        sender: "Gemini",
      },
    ]);
  }, []); // Si esegue solo al primo render del componente

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      // Invia la cronologia completa
      const response = await processMessageToGemini([...messages, newMessage]);
      const content = response.response?.text();
      if (content) {
        const geminiResponse = {
          message: content,
          sender: "Gemini",
        };
        setMessages((prevMessages) => [...prevMessages, geminiResponse]);
      }
    } catch (error) {
      console.error("Error during message processing:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const processMessageToGemini = async (chatMessages) => {
    const prompt = chatMessages.map((messageObject) => {
      return `${messageObject.sender === "Gemini" ? "AI:" : "User:"} ${messageObject.message}`;
    }).join("\n");

    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      console.error("Error during Gemini API call:", error);
      throw error;
    }
  };

  return (
    <div style={{ position: "relative", height: "800px", width: "700px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={isTyping ? <TypingIndicator content="Gemini is typing" /> : null}
          >
            {messages.map((message, i) => (
              <Message
                key={i}
                model={{
                  message: message.message,
                  sentTime: message.sentTime || "just now",
                  sender: message.sender,
                  direction: message.sender === "user" ? "outgoing" : "incoming",
                }}
              />
            ))}
          </MessageList>
          <MessageInput 
            placeholder="Send a Message" 
            onSend={handleSendRequest} 
            attachButton={false} 
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatAi;
