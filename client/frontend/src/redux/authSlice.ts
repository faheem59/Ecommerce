// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../utils/interface';

interface AuthState {
    token: string | null;
    user: User | null
}

const initialState: AuthState = {
    token: null,
    user: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearAuthToken(state) {
            state.token = null;
        },
        logout(state) {
            state.user = null;
        },
    },
});

export const { setAuthToken, clearAuthToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
