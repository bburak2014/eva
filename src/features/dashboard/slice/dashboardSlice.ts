// src/features/dashboard/slice/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toastManager } from '@/shared/utils/toastManager';
import { DashboardState ,User} from '@/features/dashboard/types/dashboardTypes';


const initialState: DashboardState = {
    selectedDay: 30,
    selectedDates: [],
    currentPage: 1,
    user: null
};
 
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setSelectedDay(state, action: PayloadAction<number>) {
            state.selectedDay = action.payload;
        },
        // Toggle a date selection from the chart (for table view)
        toggleSelectedDate(state, action: PayloadAction<string>) {
            const date = action.payload;
            const index = state.selectedDates.indexOf(date);
            if (index >= 0) {
                state.selectedDates.splice(index, 1);
            } else {
                if (state.selectedDates.length < 2) {
                    state.selectedDates.push(date);
                } else {
                    toastManager.showToast('You can not compare more than 2 days', 'info', 3000);

                }
            }
        },
        // Set the current page for the sales table pagination
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        // Reset the dashboard UI state (useful when changing filters or leaving page)
        resetDashboardState(state) {
            state.selectedDates = [];
            state.currentPage = 1;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
          },
    }
});

export const {
    setSelectedDay,
    toggleSelectedDate,
    setCurrentPage,
    resetDashboardState,
    setUser
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
