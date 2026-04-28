import { createSlice } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { getAboutUser, getAllUsers, loginUser, registerUser } from "../../action/authAction";
import { act } from "react";
import { getConnectionRequests, getMyConnectionRequest } from "../../action/authAction";


const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading : false,
    loggedIn: false,
    isTokenThere : false,
    message: "",
    profileFetched: false,
    connections: [],
    all_users : [],
    all_profiles_fetched : false,
    connectionRequest: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset : () => initialState,
        handleLoginUser: (state) => {
            state.message= "hello"
        },
        emptyMessage: (state) => {
            state.message = "";
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Logging you..."
            })
            .addCase(loginUser.fulfilled, (state, action) => {

                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "Login Successfull";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || action.payload || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering you...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                 state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = "Registeration Successfull , Please Login..";
            })
             .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                     state.message = action.payload?.message || action.payload || "Registration failed";
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.profileFetched = true;
                state.user = action.payload.userProfile;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isError= false;
                state.isLoading = false;
                state.all_profiles_fetched = true;
                state.all_users = action.payload.profiles;
            })
            .addCase(getConnectionRequests.fulfilled, (state, action) => {

                state.connections = action.payload;
            })
            .addCase(getConnectionRequests.rejected, (state, action) => {
                state.message = action.payload || "Failed to fetch connections";    
            })
            .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
                state.connectionRequest = action.payload;
            })
            .addCase(getMyConnectionRequest.rejected, (state, action) => {
                state.message = action.payload || "Failed to fetch connections";
            })
    }
});

export  const {reset, emptyMessage, setTokenIsNotThere, setTokenIsThere} = authSlice.actions;
export default authSlice.reducer;