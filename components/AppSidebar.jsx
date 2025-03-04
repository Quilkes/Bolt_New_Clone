import { MessageCircleCode, SidebarCloseIcon, Menu } from "lucide-react";
import Image from "next/image";
import WorkspaceHistory from "./WorkspaceHistory";
import Link from "next/link";
import UserDropdown from "./custom/UserDropdown";
import useSidebar from "@/store/sidebar";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useContext } from "react";

export function AppSidebar({ children }) {
  const { sideBar, setSidebar } = useSidebar();
  const { userDetail } = useContext(UserDetailContext);

  const handleToggleSidebar = () => {
    setSidebar(!sideBar);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`h-screen bg-slate-100 border-r shadow-sm transition-all duration-300 ${
          sideBar ? "w-[250px] opacity-100 delay-300" : "w-0 opacity-0"
        }`}
      >
        <div
          className={`h-full flex flex-col transition-opacity duration-300 ${
            sideBar ? "opacity-100 delay-500" : "opacity-0"
          }`}
        >
          {sideBar && (
            <>
              {/* Header */}
              <div className="p-5 pb-0 relative">
                <div className="flex items-center justify-between">
                  <Image src={"/logo.png"} alt="logo" width={30} height={30} />
                  <SidebarCloseIcon
                    onClick={handleToggleSidebar}
                    className="cursor-pointer text-slate-500"
                  />
                </div>
                <Link href={"/"} className="mt-3 w-full block">
                  <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-slate-100 hover:border-purple-500 border hover:text-purple-500 transition-colors">
                    <MessageCircleCode /> New Chat
                  </button>
                </Link>
              </div>

              {/* Content */}

              <div className="flex-grow overflow-auto px-3">
                <div className="py-2">
                  <WorkspaceHistory />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t">
                <UserDropdown />
              </div>
            </>
          )}
        </div>
      </div>
      {!userDetail && (
        <div className="mt-4 text-purple-600">
          <diiv className="p-5 text-lg">Holtex AI</diiv>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-grow transition-all duration-300">
        {/* Toggle button for closed sidebar */}
        {userDetail && (
          <>
            {!sideBar && (
              <button
                onClick={handleToggleSidebar}
                className="absolute top-4 left-4 p-2 rounded-md hover:bg-slate-100 transition-colors z-20"
              >
                <Menu size={24} />
              </button>
            )}
          </>
        )}

        <div className="flex-grow overflow-auto">{children}</div>
      </div>
    </div>
  );
}
