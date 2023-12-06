import { legacy_createStore as createStore } from 'redux';
import chatReducer from './reducers/reducers';

const store = createStore(chatReducer);

export default store;