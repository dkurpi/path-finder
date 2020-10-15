import React from "react";
import { HiCursorClick } from "react-icons/hi";
import "../css/intro.css";

export default function StartPopup() {
  return (
    <div className="intro">
      <div className="intro__cursor">
        <HiCursorClick />
      </div>
      <h4 className="intro__title">Click to add the walls!</h4>
    </div>
  );
}
