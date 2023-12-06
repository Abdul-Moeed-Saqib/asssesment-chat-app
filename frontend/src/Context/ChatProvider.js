import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { setUser, setChatSelected, setChats } from './actions/actions';
import store from './store';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, chatSelected, chats, notification} = useSelector((state) => state);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    dispatch(setUser(userInfo));

    if (!userInfo) {
      navigate('/');
    }
  }, [dispatch, navigate]);

  return (
    <ChatContext.Provider value={{ user, chatSelected, chats, notification}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

const ReduxProvider = ({ children }) => (
  <Provider store={store}>
    <ChatProvider>{children}</ChatProvider>
  </Provider>
);

export default ReduxProvider;