// Importing necessary functions and modules from Redux Toolkit and redux-persist
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Combining all the reducers into a root reducer
// In this case, there is only one reducer (userReducer)
const rootReducer = combineReducers({ 
  user: userReducer 
});

// Configuration object for redux-persist
// It specifies the key for storage and the storage mechanism to use
const persistConfig = {
  key: 'root', // The key for the persisted state in storage
  storage, // The storage mechanism to use (localStorage for web)
  version: 1, // Version of the persisted state
};

// Enhancing the root reducer with persist capabilities
// This will enable the state to be saved in storage and rehydrated on app reload
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuring the Redux store
// This includes setting up the persisted reducer and applying default middleware
// The serializableCheck middleware is disabled to avoid issues with non-serializable values in the state
export const store = configureStore({
  reducer: persistedReducer, // Setting the persisted reducer as the root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabling serializable state check middleware
    }),
});

// Creating a persistor which will be used to persist and rehydrate the store
export const persistor = persistStore(store);
