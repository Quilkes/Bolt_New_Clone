import { create } from "zustand";

const useSidebar = create((set) => ({
  sideBar: false,
  setSidebar: (bool) => set({ sideBar: bool }),
}));

export default useSidebar;
