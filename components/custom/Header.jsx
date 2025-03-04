import Image from "next/image";
import React, { useContext, useState } from "react";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { usePathname } from "next/navigation";
import { ActionContext } from "@/app/context/ActionContext";
import { LucideDownload, Rocket } from "lucide-react";
import SignInDialog from "./SignInDialog";
import useSidebar from "@/store/sidebar";

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { setAction } = useContext(ActionContext);
  const { sideBar, setSidebar } = useSidebar();
  const path = usePathname();
  const [openDialog, setOpenDialog] = useState(false);

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="px-4 py-2 flex relative justify-between bg-white items-center">
      <div className="flex items-center justify-between gap-5"></div>
      <>
        {!userDetail ? (
          <div className="flex gap-3">
            <button
              className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
              onClick={() => setOpenDialog(true)}
            >
              Sign In
            </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            {path?.includes("workspace") && (
              <div className="flex gap-2 items-center">
                <button
                  className="px-4 py-2 border border-purple-500 text-purple-700 rounded-md hover:bg-purple-50 transition-colors flex items-center"
                  onClick={() => onActionBtn("export")}
                >
                  <LucideDownload className="mr-2" size={16} /> Export
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center"
                  onClick={() => onActionBtn("deploy")}
                >
                  <Rocket className="mr-2" size={16} /> Deploy
                </button>
              </div>
            )}
            <Image
              src={userDetail?.picture}
              alt="user"
              width={30}
              height={30}
              className="rounded-full w-[30px] h-[30px] cursor-pointer"
              onClick={() => {
                setSidebar(!sideBar);
              }}
            />
          </div>
        )}
      </>

      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
}

export default Header;
