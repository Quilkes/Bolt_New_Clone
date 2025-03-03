"use client";
import { MessageContext } from "@/app/context/MessagesContext";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export const countToken = (inputText) => {
  return inputText
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;
};

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessageContext) || {
    messages: [],
    setMessages: () => {},
  };
  const [userInput, setUserInput] = useState();
  const [loading, setLoading] = useState(false);
  const UpdateMessage = useMutation(api.workspace.UpdateMessage);
  const router = useRouter();

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  useEffect(() => {
    if (!userDetail) {
      router.push("/");
      return;
    }
  }, [userDetail]);

  // used to et workspace data using workspace id
  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    await setMessages(result?.messages || []);
  };

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == "user") {
        GetAiResponce();
      }
    }
  }, [messages]);

  const GetAiResponce = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });

    const aiResp = {
      role: "ai",
      content: result.data.result,
    };

    setMessages((prev) => [...prev, aiResp]);

    await UpdateMessage({
      messages: [...messages, aiResp],
      workspaceId: id,
    });

    const remTokens =
      Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));

    setUserDetail((prev) => ({ ...prev, token: remTokens }));

    console.log("Upadated the db workspace and new tokens are", remTokens);
    setLoading(false);
  };

  const onGenerate = (input) => {
    if (userDetail?.token < 10) {
      toast("You don't have enough token!");
      router.push("/pricing");
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);

    setUserInput("");
  };

  return (
    <div className="relative h-[87.5vh] w-full flex flex-col bg-slate-50 rounded-md">
      <div className="flex-1 overflow-y-scroll scrollbar-hide rounded-lg">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className="p-3 rounded-lg mb-2 flex gap-2 bg-slate-100 items-center leading-7"
          >
            {msg.role == "user" && (
              <Image
                src={userDetail?.picture}
                width={35}
                height={35}
                className="rounded-full"
                alt=""
              />
            )}
            <ReactMarkdown className="flex flex-col">
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}

        {loading && (
          <div className="p-5 rounded-lg mb-2 flex gap-2 items-center bg-black/40">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
      </div>

      {/* input section */}
      <div className="flex gap-2 items-end">
        <div className="p-5 border rounded-xl max-w-2xl w-full mt-3 bg-slate-100">
          <div className="flex gap-2">
            <textarea
              type="text"
              placeholder={Lookup.INPUT_PLACEHOLDER}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 p-2  h-10 w-10 rounded-md cursor-pointer"
              />
            )}
          </div>

          <div>
            <Link className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
