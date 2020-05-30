import React from "react";

export default function Button({ clickFcn, text, disable, className }) {
  return (
    <button
      class={className}
      onClick={() => {
        if (disable) return;
        clickFcn();
      }}
    >
      {text}
    </button>
  );
}
