import { PrismaClient } from "../generated/prisma";


export const prismaClient = new PrismaClient

// this isn't the best, we should introduce a singleton over here

