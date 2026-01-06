import { UUID } from "crypto";
import { auth } from "./lib/auth";

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

export type Task = {
  id: string;
  taskId: string;
  userId: UUID;
  bucketId: string;
  name: string;
  color: string;
  startDateTime: Date;
  endDateTime: Date;
  notes: string;
};
