import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import waterpointReducer from "./features/waterpointsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    waterpoint: waterpointReducer,
  },
});
