import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "posts/getAllPosts",
    async ( _, thunkAPI) => {

        try {

            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {

            return thunkAPI.rejectWithValue(error.response.data);
        };
    }
);

export const createPost = createAsyncThunk(
    "post/createPost", 
    async (userData, thunkAPI) => {
        const { file, body }  = userData;

        try {
                    const formData = new FormData();
                    formData.append("token", localStorage.getItem("token"));
                    formData.append("body", body);
                    formData.append("media", file);

                const response = await clientServer.post("/post", formData, {
                    headers: {
                        "Content-Type":  "multipart/form-data"
                    }
                });

                if( response. status === 200) {
                    return thunkAPI.fulfillWithValue(response.data.post);

                } else {
                    return thunkAPI.rejectWithValue("Post not Uploaded");
                }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id, thunkAPI) => {
        try {

            const response = await clientServer.delete("/delete_post", {
                data: {
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id,
                }
            });

            return thunkAPI.fulfillWithValue(response.data);
            
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        };
} );

export const increamentLike = createAsyncThunk(
    "post/increamentLike",
    async (post_id, thunkAPI) => {

        try {
                    const response = await clientServer.post("/increament_post_like", {
                        post_id: post_id.post_id,
                     });

                    return thunkAPI.fulfillWithValue(response.data);
                        
        } catch (error ) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    } );

    export const getAllComments = createAsyncThunk( 
        "post/getAllComments",
        async ( postData, thunkAPI) => {

            try {
                const response = await clientServer.get("/get_comments", {
                    params: {
                        post_id: postData.post_id,
                    }
                });
                return thunkAPI.fulfillWithValue({
                    comments: response.data?.comments || [],
                    post_id: postData.post_id,
                });

            } catch (error) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
        } );

    export const postComment = createAsyncThunk(
        "post/postComment",
        async ( commentData, thunkAPI) => {

            try {
                 console.log( {
                    post_id: commentData.post_id,
                    body: commentData.body,
                 });

                  const response = await clientServer.post("/comment",{
                    token: localStorage.getItem("token"),
                    post_id: commentData.post_id,
                    commentBody: commentData.body,
                 });
                    return thunkAPI.fulfillWithValue(response.data);

            } catch (error) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
        } );

export const sendConnectionRequest = createAsyncThunk(
    "post/sendConnectionRequest",
    async ( user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.userId,
            });

            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }

    } );

export const getConnectionRequests = createAsyncThunk(
    "post/getConnectionRequests",
    async ( user, thunkAPI) => {

        try {

            const response = await clientServer.get("/user/getConnectionRequests", {
                params: {
                    token: user.token,
                }
            });

            return thunkAPI.fulfillWithValue(response.data.connections);

        } catch (error) {

            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    });

export const getMyConnectionRequest = createAsyncThunk(
    "post/getMyConnectionRequest",
    async ( user, thunkAPI) => {

        try {
            const response = await clientServer.get("/user/user_connection_request", {
                params: {
                    token: user.token,
                }
            }); 
            return thunkAPI.fulfillWithValue(response.data.connections);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    } );

export const acceptConnectionRequest = createAsyncThunk(
    "post/acceptConnectionRequest",
    async ( user, thunkAPI) => {

        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                connectionId: user.connectionId,
                action_type: user.action,
            }); 
            return thunkAPI.fulfillWithValue(response.data);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    });
        