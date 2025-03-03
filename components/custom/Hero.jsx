"use client";
import { MessageContext } from "@/app/context/MessagesContext";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import Lookup from "@/data/Lookup";
import { MessageCircle, Send, Bot, Link, DiscIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  const [userInput, setUserInput] = useState();
  const { setMessages } = useContext(MessageContext);
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    console.log("Inside the onGenerate function");

    if (!userDetail) {
      setOpenDialog(true);
      console.log("No user details");
    }

    if (userDetail?.token < 10) {
      toast("You don't have enough token!");
      router.push("/pricing");
      return;
    }

    const msg = {
      role: "user",
      content: input,
    };

    setMessages([msg]);
    console.log("userDetail", userDetail);

    const workspaceId = await CreateWorkspace({
      user: userDetail?._id,
      messages: [msg],
    });

    console.log("workspaceID----> ", workspaceId);

    router.push("/workspace/" + workspaceId);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-36  gap-2 ">
      <h2 className="font-bold text-4xl"> {Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

      <div
        className="p-5 border-2 border-transparent rounded-xl transition-all 
      shadow-[0_0_3px_rgba(59,130,246,0.4)] hover:shadow-[0_0_5px_rgba(124,58,237,0.5)] 
      hover:border-purple-400 focus-within:shadow-[0_0_6px_rgba(59,130,246,0.6)] 
      focus-within:border-blue-400 w-full max-w-2xl mt-3"
      >
        <div className="flex gap-2">
          <textarea
            type="text"
            placeholder={Lookup.INPUT_PLACEHOLDER}
            onChange={(e) => setUserInput(e.target.value)}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
          />
          <AnimatePresence>
            {userInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                onClick={() => onGenerate(userInput)}
                className="p-2 text-white h-10 w-10 bg-blue-600 rounded-lg hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Bot className="w-4 h-4" />
        <span>AI Assistant is ready to help you build your project</span>
      </div>
      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-purple-800 cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
      {/* Footer */}
      <footer className="pt-12 mt-16 border-t border-gray-200">
        <div className="text-center">
          <div className="inline-block mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Holtex AI is in its experimental stage
          </div>

          <p className="mb-6 text-gray-600">
            Built with ❤️ by Holtex AI. Empowering developers to build smarter.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <DiscIcon className="w-5 h-5 text-gray-600" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Holtex AI. All rights reserved.
          </p>
        </div>
      </footer>

      <SignInDialog
        openDialog={openDialog}
        closeDialog={(v) => setOpenDialog(v)}
      />
    </div>
  );
};

export default Hero;
