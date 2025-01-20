import { handleAdmin } from "@/lib/utils"
export const GET = async (req) => {
  return await handleAdmin(req, async () => {
    const roles = await prisma.role.findMany()
    return Response.json(roles, {status: 200})
  })
}
