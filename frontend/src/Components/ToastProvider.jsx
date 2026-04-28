"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1000}
      toastStyle={{
        background: "#1b6abf",
        color: "#fff",
      }}
  progressStyle={{
    background: "#fff",
  }}
    />
  );
}