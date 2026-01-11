import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDb } from "./lib/db.js";
import cors from "cors";
import {serve} from "inngest/express"
import { inngest,functions } from "./lib/inngest.js";
import {clerkMiddleware} from '@clerk/express'
import chatRoutes from './routes/chatRoutes.js'
const app = express();

const __dirname = path.resolve();

app.use(express.json());

app.use(cors({ origin: ENV.CLIENT_URL,credentials: true,}));

app.use(clerkMiddleware()) //this add auth field to request object:req.auth()
app.use("/api/inngest",serve({client:inngest,functions}))




app.get("/api", (req, res) => {
  res.status(200).json({
    msg: "hello world",
  });
});

app.use("/api/chat",chatRoutes)



// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

const startserver = async () => {
  await connectDb();
  try {
    app.listen(ENV.PORT, () => {
      console.log(`server is running on port`, ENV.PORT);
    });
  } catch (error) {
    console.error("error occured at the start of the server");
  }
};
startserver();
