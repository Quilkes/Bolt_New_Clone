import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { MessageCircleCode, SidebarCloseIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import WorkspaceHistory from "./WorkspaceHistory";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="p-5 pb-0 relative">
        <div className="flex items-center justify-between">
          <Image src={"/logo.png"} alt="log" width={30} height={30} />
          <SidebarCloseIcon
            onClick={toggleSidebar}
            className="cursor-pointer"
          />
        </div>

        <Link href={"/"} className="mt-3 w-full">
          {" "}
          <Button className="w-full bg-purple-500 hover:bg-slate-100 hover:border-purple-500 hover:border hover:text-purple-500">
            {" "}
            <MessageCircleCode /> Start New Chat
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}
