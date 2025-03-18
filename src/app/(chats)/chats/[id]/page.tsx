"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

let socket: typeof Socket;

interface Message {
  user: string;
  text: string;
}

interface ChatPageProps {
  params: {
    id: string; // Chat room ID or user identifier
  };
}

const ChatPage = ({ params }: ChatPageProps) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Connect to the server and join a room based on `params.id`
    socket = io();

    // Join the specific room
    socket.emit("join_room", params.id);

    // Listen for incoming messages
    socket.on("receive_message", (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [params.id]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const messagePayload = { room: params.id, user: "You", text: message };
      socket.emit("send_message", messagePayload); // Send the message to the server
      setMessages((prev) => [...prev, { user: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room: {params.id}</h1>
      <div className="border rounded p-4 h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}: </strong>{msg.text}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border px-4 py-2 rounded mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
