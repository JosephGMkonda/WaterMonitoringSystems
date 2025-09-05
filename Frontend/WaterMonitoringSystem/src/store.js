import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import waterpointReducer from "./features/waterpointsSlice"
import dashboardReducer from "./features/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    waterpoint: waterpointReducer,
    dashboard: dashboardReducer,
  },
});
