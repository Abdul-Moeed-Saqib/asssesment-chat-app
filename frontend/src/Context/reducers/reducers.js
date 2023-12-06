import { SET_USER, SET_CHAT_SELECTED, SET_CHATS, SET_NOTIFICATION } from './../actions/actions';

const initialState = {
  user: null,
  chatSelected: null,
  chats: [],
  notification: []
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };

    case SET_CHAT_SELECTED:
      return { ...state, chatSelected: action.payload };

    case SET_CHATS:
      return { ...state, chats: action.payload };

    case SET_NOTIFICATION:
      return { ...state, notification: action.payload };

    default:
      return state;
  }
};

export default chatReducer;