import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";




export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (id) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${id}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: (user) => {
        set({ selectedUser: user })
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            toast.success("Message sent successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // realtime chating

    listenToMessages:()=>{
        const {selectedUser}=get();

        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            
            if(newMessage.senderId !== selectedUser._id) return;

            set({
                messages:[...get().messages,newMessage],
            });
        });
    },
    unListenToMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

}));