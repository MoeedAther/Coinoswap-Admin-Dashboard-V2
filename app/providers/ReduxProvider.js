"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/store/store"; // matches export const store

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
