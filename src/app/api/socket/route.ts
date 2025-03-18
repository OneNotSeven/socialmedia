import { Server } from "socket.io";
import { NextResponse } from "next/server";

interface MessagePayload {
  message: string;
  room: string;
}

let io: Server | undefined;

export async function POST(request: Request) {
  const { socket } = request as any;
  if (!socket.server.io) {
    io = new Server(socket.server);
    socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New socket connected");

      socket.on("join_room", (room: string) => {
        socket.join(room);
      });

      socket.on("send_message", ({ message, room }: MessagePayload) => {
        io?.to(room).emit("receive_message", { user: "Other", text: message });
      });
    });
  }
  return NextResponse.json({ message: "Socket.io server initialized." }, { status: 200 });
}