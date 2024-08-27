// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const itemIndex = state.items.findIndex(item => item.name === action.payload.name);
            if (itemIndex >= 0) {
                state.items[itemIndex].quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        updateQuantity: (state, action: PayloadAction<{ name: string; quantity: number }>) => {
            const itemIndex = state.items.findIndex(item => item.name === action.payload.name);
            if (itemIndex >= 0) {
                state.items[itemIndex].quantity = action.payload.quantity;
                if (state.items[itemIndex].quantity <= 0) {
                    state.items.splice(itemIndex, 1);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addItem, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
