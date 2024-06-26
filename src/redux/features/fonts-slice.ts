import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fontsLoader } from "../../helpers/hooks/fontsLoader";
import { InitialStateType } from "../../types";
import instsnce from "../../api/index";
import { AxiosResponse } from "axios";

const API_KEY: string = "AIzaSyBMMUn07zAhSSJW_437OhdXfSBfbd_2Fco";
sessionStorage.setItem("api_key", API_KEY)

const initialState: InitialStateType = {
    fonts_data: [],
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: null,
    input_value: "",
    search_select: "",
}

const getFonts = createAsyncThunk("fonts", async (value: any, {rejectWithValue} : {rejectWithValue: any}) => {
    try {
        const response: AxiosResponse = await instsnce.get(`/webfonts?key=${API_KEY}${value ? "&sort="+value : ""}`)
        response.data.items.map((font:any)=>{fontsLoader(font.family)})
        return response.data.items
    }
    catch (error: any) {
        console.log(error);
        return rejectWithValue(error.response.data)      
    }

})

const fontsSlice = createSlice({
    name: "fonts",
    initialState,
    reducers: {
        inputValue: (state, action) => {
            state.input_value = action.payload
        },
        searchSelect: (state, action) => {
            state.search_select = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getFonts.pending, (state, _) => {
            state.isLoading = true
        }),
        builder.addCase(getFonts.fulfilled, (state, action) => {
            state.isLoading = false,
            state.isSuccess = true,
            state.isError = false,
            state.fonts_data = action.payload
            state.message = "Successfully added"
        }),
        builder.addCase(getFonts.rejected, (state, _) => {
            state.isError = true,
            state.isSuccess = false,
            state.message = "Something went wrong!"
        })
    }
})

export const { inputValue, searchSelect } = fontsSlice.actions;
export { getFonts };
export default fontsSlice.reducer;