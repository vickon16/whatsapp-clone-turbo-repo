import { Toaster } from "@/components/ui/sonner";
import { StateProvider } from "@/context/StateContext";
import React from "react";
import ReactQueryProvider from "./ReactQueryProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StateProvider>
      <ReactQueryProvider>
        <Toaster />
        {children}
      </ReactQueryProvider>
    </StateProvider>
  );
};

export default Providers;
