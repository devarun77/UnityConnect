import { createSlice } from "@reduxjs/toolkit";
import { reset } from "../authReducer";
import { createPost, getAllComments, getAllPosts } from "../../action/postAction";



const initialState = {
    posts:[],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers:{
        reset : () => initialState,

        resetPostId: (state) => {
            state.postId = ""
        },
        
    },
    extraReducers: (builders) => {
        builders
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
                state.message = " Fetching All Posts ...";
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.postFetched = true;
                state.posts = action.payload.posts.reverse();
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isError = true;
                state.isLoading = false;
                state.message = action.payload
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.unshift(action.payload);
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.postId = action.payload.post_id;
                state.comments = Array.isArray(action.payload.comments)
                    ? action.payload.comments
                    : [];
            });

    }
});

export  const { resetPostId} = postSlice.actions;

export default postSlice.reducer;
