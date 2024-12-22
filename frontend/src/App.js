import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/ErrorPage";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Homepage />} exact></Route>
            {/* Home Page */}
            <Route path="/chats" element={<ChatPage />}></Route>
            {/* chat Page */}
            <Route path="*" element={<NotFound />}></Route>
            {/* Error Page */}
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
};

export default App;
