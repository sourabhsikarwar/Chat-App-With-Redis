"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div>
      <div>
        <h1>All Messages</h1>
      </div>
      <div>
        <input
          type="text"
          className={classes["chat-input"]}
          placeholder="type message..."
          onChange={e => setMessage(e.target.value)}
        />
        <button className={classes["button"]} onClick={() => sendMessage(message)}>Send</button>
      </div>
      <ul>
        {messages.map((msg, ind) => <li key={ind}>{msg}</li>)}
      </ul>
    </div>
  );
}
