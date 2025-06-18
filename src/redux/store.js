import {configureStore} from '@reduxjs/toolkit';
import rootReducers from './reducer';
import { createStore } from "redux";
import { Provider } from 'react-redux';

const toEnhancer = Window._REDUX_DEVTOOLS_EXTENSION_COMPOSE_
// export const store = createStore(rootReducers , toEnhancer);
export const store = configureStore({
    reducer: rootReducers, 

})
