import { LogOut, Wallet } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { MessageContext } from "@/app/context/MessagesContext";
import { useSidebar } from "../ui/sidebar";
import { toast } from "sonner";

function UserDropdown() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const { setMessages } = useContext(MessageContext);
  const { toggleSidebar } = useSidebar();

  const options = [
    {
      name: "My Subscription",
      icon: Wallet,
      path: "/pricing",
    },

    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const OnOptionClik = (option) => {
    if (option.name == "Sign Out") {
      toast.success("Signed Out Successfully");

      toggleSidebar();
      localStorage.clear();
      setUserDetail(null);
      setMessages(null);
      router.push("/");
      return;
    }

    if (option?.path == null) {
      return;
    }
    router.push(option?.path);
  };

  return (
    <div className="p-2 w-full px-3">
      <div className="bg-slate-50 rounded-xl shadow-md border">
        {options.map((option, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => OnOptionClik(option)}
            className={`w-full flex justify-start rounded-none hover:bg-purple-100 
            ${index === 0 ? "rounded-t-lg " : "rounded-none"} 
            ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
          >
            <option.icon />
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default UserDropdown;
