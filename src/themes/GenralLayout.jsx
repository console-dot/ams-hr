import React from "react";
import { Footer, Navbar } from "../components";

export const GenralLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="min-h-[calc(100vh-80px-50px)]">{children}</main>
      <Footer />
    </div>
  );
};
