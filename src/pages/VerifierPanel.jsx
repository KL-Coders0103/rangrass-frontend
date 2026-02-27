import { useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VerifierPanel() {

  const [ticket, setTicket] = useState("");
  const [status, setStatus] = useState("");
  const inputRef = useRef();

  const beep = () => {
    new Audio(
      "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
    ).play();
  };

  const verify = async (num) => {

    const res = await axios.post(
      "http://localhost:5000/verify/verify",
      { ticketNumber: num }
    );

    setStatus(res.data);

    if (res.data === "VALID") {
      beep();
      socket.emit("verified", num);
    }

    setTicket("");

    setTimeout(() => setStatus(""), 2000);

    inputRef.current.focus();
  };

  return (
    <div className="h-screen flex items-center justify-center">

      {status && (
        <div
          className={`absolute inset-0 flex items-center justify-center text-5xl font-bold text-white
            ${status === "VALID" && "bg-green-500"}
            ${status === "INVALID" && "bg-red-500"}
            ${status === "DUPLICATE" && "bg-orange-500"}
          `}
        >
          {status}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">

        <h1 className="text-3xl font-bold mb-4">
          🚪 Gate Entry
        </h1>

        <input
          ref={inputRef}
          autoFocus
          className="border p-4 rounded text-2xl w-72 text-center"
          placeholder="Scan / Enter Ticket"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify(ticket)}
        />

        <p className="mt-3 text-gray-500">
          Press ENTER to verify
        </p>

      </div>

    </div>
  );
}