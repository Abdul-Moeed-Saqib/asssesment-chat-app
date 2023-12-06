export const SET_USER = 'SET_USER';
export const SET_CHAT_SELECTED = 'SET_CHAT_SELECTED';
export const SET_CHATS = 'SET_CHATS';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setChatSelected = (chatSelected) => ({
  type: SET_CHAT_SELECTED,
  payload: chatSelected,
});

export const setChats = (chats) => ({
  type: SET_CHATS,
  payload: chats,
});

export const setNotification = (chats) => ({
  type: SET_NOTIFICATION,
  payload: chats,
});