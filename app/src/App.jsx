//Required Imports
import { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import Dashboard from './Dashboard.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//API_KEY
const API_KEY = "sk-proj-4n9ZPRyGnLcppuWWCbSMT3BlbkFJc3JD1ObM7FNpIPA5X2Pb";

//Const systemMessage to help the chatbot explain things to the user.
const systemMessage = {
  "role": "system",
  "content": "Explain things like you're talking to a software professional with 2 years of experience."
};

//Function app which is the main functions of the app that will give you the message and other things.
function App() {
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || [
    {
      message: "Hello, I'm Farron! Ask me anything!",
      sentTime: "just now",
      sender: "Farron",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  //Useeffect help the messages become stored
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  //Useeffect help the messages send notifications
  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        toast.info("Notification permission granted.");
      }
    });
  }, []);

  //UseEffect
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === "Farron") {
      new Notification("New message from Farron", {
        body: messages[messages.length - 1].message,
      });
    }
  }, [messages]);

  //const handleSend which allows sending messages to the bot
  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    //The methods are declared to allow the chatbot to function
    const newMessages = [...messages, newMessage];
    
    //Allows for newMessages
    setMessages(newMessages);

    //The type is true to allow typing
    setIsTyping(true);
    //await processMessageToFarron
    await processMessageToFarron(newMessages);
  };

  //Helps process message to Farron(chat bot)
  async function processMessageToFarron(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Farron" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });
    //Gives you the model of the api
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    };
    //fetch the chat
    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => data.json())
    //Help messages be set
    .then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "Farron",
        direction: "incoming"
      }]);
      setIsTyping(false);
    });
  }
  //Shows activityData through messages
  const activityData = [
    { time: '2024-06-07T12:00:00Z', value: 10 },
    { time: '2024-06-07T13:00:00Z', value: 20 },
    { time: '2024-06-07T14:00:00Z', value: 15 },
    // Add more data points here
  ];
//Gives settings to style the UI and help show dashboard
  return (
    <div className="App">
      <ToastContainer />
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="Farron is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message
                  key={i}
                  model={{
                    message: message.message,
                    sentTime: message.sentTime,
                    sender: message.sender,
                    direction: message.direction
                  }}
                />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      <Dashboard activityData={activityData} />
    </div>
  );
}
//export the appnp
export default App;