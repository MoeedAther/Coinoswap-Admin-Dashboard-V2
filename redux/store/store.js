import { configureStore } from '@reduxjs/toolkit'
import slice from '../slices/slice'
import authReducer from '../slices/authSlice'

export const store = configureStore({
  reducer: {
    example: slice,
    auth: authReducer,
  },
})