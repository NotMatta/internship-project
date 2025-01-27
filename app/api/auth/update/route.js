import { decryptData, encryptData, handle, validatePassword } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const PUT = async (req) => {
  return await handle(req,[""],async ({tokenRes}) => {
    const body = await req.json()
    if(body.newPassword !== body.confirmPassword){
      return Response.json("Passwords do not match", {status: 400})
    }

    if(validatePassword(body.password) != "Password is valid." || validatePassword(body.newPassword) != "Password is valid."){
      return Response.json(validatePassword(""), {status: 400})
    }

    if(body.password == body.newPassword){
      return Response.json("New password cannot be the same as the old password", {status: 400})
    }
    const user = await prisma.user.findUnique({where:{id:tokenRes.body.user.id}})
    const storedPassword = decryptData(user.password,secret)

    if(body.password != storedPassword){
      return Response.json("Incorrect password", {status: 400})
    }
    const newPassword = encryptData(body.newPassword,secret)
    await prisma.user.update({
      where: {id: tokenRes.body.user.id},
      data: {
        password: newPassword
      }
    })
    await prisma.log.create({
      data: {
        message: `"${tokenRes.body.user.name}" changed their password`,
        action: "UPDATE_USER",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json("Password updated", {status: 200})
  })
}

