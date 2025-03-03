import { create } from "zustand";

const useMessageStore = create((set) => ({
  message: [],

  setMessages: (msg) =>
    set(() => ({
      message: Array.isArray(msg) ? msg : [],
    })),
}));

export default useMessageStore;
