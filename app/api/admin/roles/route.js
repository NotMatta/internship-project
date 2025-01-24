import prisma from "@/prisma/prisma-client"
import { handle } from "@/lib/utils"
export const GET = async (req) => {
  return await handle(req,["READ_ROLES"], async () => {
    const roles = await prisma.role.findMany()
    return Response.json(roles, {status: 200})
  })
}
