import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getWaterPoints = createAsyncThunk(
  "waterpoint/getWaterPoints",
  async ({ page = 1, pageSize = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/waterpoints/", {
        params: {
          page,
          limit: pageSize
        }
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch waterpoints");
    }
  }
);

const waterpointSlice = createSlice({
  name: "waterpoint",
  initialState: {
    waterpoints: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; 
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWaterPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWaterPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.waterpoints = action.payload.results || action.payload;
        state.totalCount = action.payload.count || action.payload.length;
        state.totalPages = action.payload.total_pages || Math.ceil((action.payload.count || action.payload.length) / state.pageSize);
      })
      .addCase(getWaterPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize, clearError } = waterpointSlice.actions;
export default waterpointSlice.reducer;