import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import User from "../models/User.js";
import { ENV } from "./env.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = ENV.INNGEST_EVENT_KEY
  ? new Inngest({
      id: "CodeChat",
      eventKey: ENV.INNGEST_EVENT_KEY, 
    })
  : null;


const syncUser = inngest?.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDb();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    await User.create({
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    });
    await upsertStreamUser({
      id:newUser.clerkId.toString(),
      name:newUser.name,
      img:newUser.profileImage,
    })
  }
);

const deleteUserFromDB = inngest?.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDb();
    await User.deleteOne({ clerkId: event.data.id });

    await deleteStreamUser(clerkId.toString())
  }
);

export const functions = [syncUser, deleteUserFromDB].filter(Boolean);
