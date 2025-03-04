"use client";
import { UserDetailContext } from "@/app/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import useSidebar from "@/store/sidebar";
import { useConvex } from "convex/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

function WorkspaceHistory() {
  const { setSidebar } = useSidebar();
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();

  const [groupedWorkspaces, setGroupedWorkspaces] = useState({
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  });

  const handleToggleSidebar = () => {
    setSidebar(false);
  };

  useEffect(() => {
    userDetail && GetAllWorkspace();
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail._id,
    });

    // Group workspaces by date
    groupWorkspacesByDate(result);
  };

  const groupWorkspacesByDate = (workspaces) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const grouped = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    workspaces.forEach((workspace) => {
      // Assuming workspace has a _creationTime field
      const creationDate = new Date(
        workspace._creationTime || workspace.messages[0]?.timestamp
      );
      creationDate.setHours(0, 0, 0, 0);

      if (creationDate.getTime() === today.getTime()) {
        grouped.today.push(workspace);
      } else if (creationDate.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(workspace);
      } else if (creationDate.getTime() >= lastWeekStart.getTime()) {
        grouped.lastWeek.push(workspace);
      } else {
        grouped.older.push(workspace);
      }
    });

    setGroupedWorkspaces(grouped);
  };

  const renderWorkspaceGroup = (workspaces, title) => {
    if (!workspaces || workspaces.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">{title}</h3>
        {workspaces.map((workspace, index) => (
          <Link href={"/workspace/" + workspace?._id} key={index}>
            <div className="hover:bg-slate-200 rounded-md px-1 py-1">
              <h2
                onClick={handleToggleSidebar}
                className="text-sm text-gray-700 mt-2 cursor-pointer truncate"
              >
                {workspace?.messages[0]?.content}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-2">
      <h2 className="font-medium text-lg mb-4">Your Recents Chat</h2>

      {renderWorkspaceGroup(groupedWorkspaces.today, "Today")}
      {renderWorkspaceGroup(groupedWorkspaces.yesterday, "Yesterday")}
      {renderWorkspaceGroup(groupedWorkspaces.lastWeek, "Last 7 Days")}
      {renderWorkspaceGroup(groupedWorkspaces.older, "Older")}

      {Object.values(groupedWorkspaces).every(
        (group) => group.length === 0
      ) && <p className="text-sm text-gray-700">No chat history found</p>}
    </div>
  );
}

export default WorkspaceHistory;
