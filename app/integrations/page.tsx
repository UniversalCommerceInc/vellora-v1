import { Header } from "@/components/header";
import IntegrationCard from "@/components/integrations-card";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <IntegrationCard showButtons={true} />
    </div>
  );
};

export default page;
