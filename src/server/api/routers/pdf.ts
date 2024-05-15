import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { images } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const imageRouter = createTRPCRouter({});