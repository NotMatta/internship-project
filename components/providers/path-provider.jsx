"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Navbar from "../navbar-component";

const PathContext = createContext();

export const PathProvider = ({ children }) => {
  const [path, setPath] = useState("")
  useEffect(() => {
    setPath(window.location.pathname.split("/").pop())
  }, [])

  const updatePath = (path) => {
    setPath(path.split("/").pop())
  }

  return <PathContext.Provider value={{ path, setPath, updatePath }}>
    <div className="w-screen h-screen flex">
      <Navbar/>
      <div className={`w-0 flex-grow h-full ${path != "" && "p-4"}`}>
        {children}
      </div>
    </div>
  </PathContext.Provider>;
}

export const usePath = () => {
  return useContext(PathContext);
}
