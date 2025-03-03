import Image from "next/image";
import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ActionContext } from "@/app/context/ActionContext";
import { LucideDownload, Rocket, SidebarCloseIcon } from "lucide-react";
import SignInDialog from "./SignInDialog";

function Header() {
  const { userDetail } = useContext(UserDetailContext);
  const { toggleSidebar } = useSidebar();
  const { setAction } = useContext(ActionContext);
  const path = usePathname();
  const [openDialog, setOpenDialog] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  console.log(path?.includes("workspace"));

  const onActionBtn = (action) => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  return (
    <div className="p-4 flex relative justify-between bg-white items-center">
      <div className="flex items-center justify-between gap-5">
        {userDetail && (
          <SidebarCloseIcon
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        )}

        <Link href={"/"} className="flex items-center gap-2">
          <Image src={"/logo.png"} alt="Logo" width={30} height={30} />
          <span className="font-extrabold text-purple-800 text-lg">
            Holtex AI
          </span>
        </Link>
      </div>

      {!userDetail ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-purple-500 text-purple-700 hover:bg-purple-50"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          {path?.includes("workspace") && (
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-700 hover:bg-purple-50"
                onClick={() => onActionBtn("export")}
              >
                <LucideDownload className="mr-2" size={16} /> Export
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => onActionBtn("deploy")}
              >
                <Rocket className="mr-2" size={16} /> Deploy
              </Button>
            </div>
          )}
          <Image
            src={userDetail?.picture}
            alt="user"
            width={30}
            height={30}
            className="rounded-full w-[30px] h-[30px] cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      )}

      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
}

export default Header;
