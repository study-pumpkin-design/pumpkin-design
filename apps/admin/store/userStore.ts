import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminTypes } from "@sd/types";

interface AdminStore {
  admin: adminTypes.Admin | null;
  setData: (data: Partial<adminTypes.Admin>) => void;
  logout: () => void;
}
export const useAdmin = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      setData: (data: Partial<adminTypes.Admin>) =>
        set((state) => ({
          admin: state.admin
            ? { ...state.admin, ...data }
            : (data as adminTypes.Admin),
        })),
      logout: () => set({ admin: null }),
    }),
    {
      name: "admin-storage",
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
);
