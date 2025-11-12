// Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {/* Top Navigation */}
      <Topbar />

      {/* Below the topbar (64px) */}
      <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden mt-16">
        {/* Sidebar */}
        <AppSidebar className={`h-full ${isMobile ? "md:flex" : "flex"}`} />

        {/* Scrollable content area */}
        <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="flex-1 py-6 px-4 md:py-8 md:px-6 lg:py-10 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;