import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from './asyncActions'

export const ProductSlice = createSlice({
    name: 'product',
    initialState:{
        newProduct : null,
        errorMessage : ''
    },
    reducers:{
        // logout : (state)=>{
        //     state.isLoading = false
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(getNewProducts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getNewProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.newProducts = action.payload;
        });

        builder.addCase(getNewProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    }
})

// export const { } = appSlice.actions

export default ProductSlice.reducer