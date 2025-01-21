import { handleAdmin } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"
export const GET = async (req) => {
  return await handleAdmin(req, async () => {
    const roles = await prisma.role.findMany()
    return Response.json(roles, {status: 200})
  })
}
