import { createContext, useContext, useEffect, useState } from "react"; //React, "chat context" often refers to a context that stores and provides state or data related to a chat application. React Context is a way to manage state globally and pass data down the component tree without having to explicitly pass props at every level.
import { useNavigate } from "react-router-dom";

const ChatContext = createContext(); //This is where you define the context for managing the state of the chat (messages, current user, chat room details, etc.).

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    //The Provider component will wrap the parts of your app that need access to the chat state. This typically happens at a higher level, like around the root component or a specific section of the app.
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
