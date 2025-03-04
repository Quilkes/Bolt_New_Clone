import { LogOut, Wallet } from "lucide-react";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { MessageContext } from "@/app/context/MessagesContext";
import { toast } from "sonner";
import useSidebar from "@/store/sidebar";

function UserDropdown() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const { setMessages } = useContext(MessageContext);
  const { sideBar, setSidebar } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggleSidebar = () => {
    setSidebar(!sideBar);
  };

  const handleLogout = () => {
    toast.success("Signed Out Successfully");
    handleToggleSidebar();
    localStorage.clear();
    setUserDetail(null);
    setMessages(null);
    router.push("/");
  };

  const options = [
    {
      name: "Subscription",
      icon: Wallet,
      path: "/pricing",
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const OnOptionClick = (option) => {
    if (option.name === "Sign Out") {
      setShowLogoutModal(true);
      return;
    }

    if (option?.path) {
      handleToggleSidebar();
      router.push(option?.path);
    }
  };

  return (
    <div className="p-2 w-full px-3">
      <div className="bg-slate-50 rounded-xl shadow-md border">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => OnOptionClick(option)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-purple-100 transition-colors
            ${index === 0 ? "rounded-t-lg" : "rounded-none"} 
            ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
          >
            <option.icon size={18} />
            <span>{option.name}</span>
          </button>
        ))}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
