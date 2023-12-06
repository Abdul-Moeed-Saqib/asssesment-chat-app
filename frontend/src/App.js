import "./App.css";
import { Button } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import { ChatState } from "./Context/ChatProvider";

function App() {
  const { user } = ChatState();

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={user ? <Navigate to={"/chats"} /> : <Home />} />
        <Route path='/chats' element={user ? <ChatPage /> : <Home />} />
      </Routes>
    </div>
  );
}

export default App;
