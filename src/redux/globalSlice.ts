import { createSlice } from "@reduxjs/toolkit";
export interface GlobalState {
    walletAddress: string | null;
}
const initialState: GlobalState = {
    walletAddress: null,
}
const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setWalletAddress: (state, action) => {
            state.walletAddress = action.payload;
        }
    }
})
export const { setWalletAddress } = globalSlice.actions;
export default globalSlice.reducer;