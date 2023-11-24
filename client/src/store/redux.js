import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import productsSlice from './products/productsSlice';
import userSlice from './user/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore ,FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist';


const  commonConfig = {
  key :'shop/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist : ['isLoggedIn','token','current']
}

export const store = configureStore({
  reducer: {
    app : appSlice,
    products : productsSlice,
    user : persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)