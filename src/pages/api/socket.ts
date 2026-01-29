import { Server } from "socket.io";

// Dùng 'any' ở đây để bỏ qua kiểm tra lỗi của TypeScript
export default function SocketHandler(req: any, res: any) {
  
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Initializing Socket...");
    
    // Khởi tạo Socket.io server
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false,
    });
    
    // Gán io vào server để dùng lại lần sau
    res.socket.server.io = io;

    io.on("connection", (socket: any) => {
      console.log("Client connected:", socket.id);

      // Lắng nghe
      socket.on("scan-data", (msg: any) => {
        console.log("Server nhận mã:", msg);
        // Bắn lại cho Web
        socket.broadcast.emit("web-receive-barcode", msg);
      });
    });
  }
  
  res.end();
}