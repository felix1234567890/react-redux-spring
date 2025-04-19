import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const store = configureStore({
  reducer: rootReducer,
  // Redux Toolkit includes thunk middleware by default
  // so we don't need to add it manually
  preloadedState: {},
  // Enable Redux DevTools Extension automatically
  devTools: process.env.NODE_ENV !== 'production',
})

export default store