import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { router } from "./routes/MainRoutes";
import { Socket } from "socket.io";

const http = require("http");
const socketIO = require("socket.io");

const server = express();
const ioServer = http.createServer(server);
//define origin and methods of IO
const io = socketIO(ioServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

dotenv.config();

server.use(express.static(path.join(__dirname, "../public")));
server.use(express.urlencoded({ extended: true }));

//define to origin and methods of cors
server.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
server.use(express.json());
server.use(router);

//receive messages from clients and save in list to show later
// Inicialize a lista de usuários vazia.
type List = {
  id: string;
  name: string;
};
let userList = <List[]>[];

io.on("connection", (socket: Socket) => {
  console.log("Usuario Conectado", socket.id);
  socket.on("Nome", (userName) => {
    console.log("Funcionou>", userName);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Usuário ${socket.data.userName} desconectado.`);
  });
  //----------------------------------------------------//

  //-----------------------------------------------------//
  socket.on("message", (text) => {
    const userName = text.userName;
    const userMessage = text.userMessage;
    console.log(
      `${userMessage}  ${userName} ${socket.id} recebida com sucesso`
    );

    io.emit("receive_message", {
      text: userMessage,
      authorId: socket.id,
      author: userName, // Usar o nome do usuário aqui
    });
  });

  // Emita a lista de usuários atualizada para todos os clientes.

  // Lida com mensagens do usuário
});

//Handling routes
server.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada" });
});
//Handling server
server.use((req: Request, res: Response) => {
  try {
    res.status(200);
    res.json({ status: "Conexão estabelecida com sucesso" });
  } catch (error) {
    res.status(404);
    res.json({ error: "Conexão perdida" });
  }
});

ioServer.listen(process.env.PORT);
