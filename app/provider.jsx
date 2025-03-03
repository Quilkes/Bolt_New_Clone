"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/custom/Header";
import { MessageContext } from "./context/MessagesContext";
import { UserDetailContext } from "./context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AddSideBar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ActionContext } from "./context/ActionContext";
import { useRouter } from "next/navigation";
import { GeminiModelContext } from "./context/GeminiModelContext";

const Provider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [action, setAction] = useState(null);
  const [geminiModel, setGeminiModel] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthChecked) {
      IsAuthenticated();
      setIsAuthChecked(true);
    }
  }, [isAuthChecked]);

  const IsAuthenticated = async () => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const user = JSON.parse(storedUser);
    const result = await convex.query(api.users.GetUser, { email: user.email });

    if (!result) {
      router.push("/");
    } else {
      setUserDetail((prev) => result ?? prev);
      console.log(result);
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <PayPalScriptProvider
        options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessageContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <GeminiModelContext.Provider
                value={{ geminiModel, setGeminiModel }}
              >
                <SidebarProvider defaultOpen={false} className="flex flex-col">
                  <Header />
                  <div className="flex">
                    <AppSidebar />
                    <div className="flex-1 overflow-hidden">{children}</div>
                  </div>
                </SidebarProvider>
              </GeminiModelContext.Provider>
            </ActionContext.Provider>
          </MessageContext.Provider>
        </UserDetailContext.Provider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  );
};

export default Provider;
