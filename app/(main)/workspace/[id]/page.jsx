import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import React from "react";

function Workspace() {
  return (
    <div className="px-3 py-2 h-[89.5vh]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ChatView />
        <div className="md:col-span-3">
          <CodeView />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
