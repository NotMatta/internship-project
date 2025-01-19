import { decryptData, encryptData, handle } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const GET = async (req) => {
    return handle(req, async ({tokenRes}) => {
      const credentials = await prisma.credential.findMany({where:{userId:tokenRes.body.user.id}})
      credentials.forEach((credential) => {
        credential.password = decryptData(credential.password,secret)
      })
      return Response.json(credentials, {status: 200})
    })
}

export const POST = async (req) => {
    return handle(req, async ({tokenRes}) => {
      const body = await req.json()
      const {name,username,password} = {name:body.name,username:body.username,password:body.password}
      if(!name || !username || !password){
        return Response.json("name, username, and password are required", {status: 400})
      }
      console.log(tokenRes.body.user.id)
      const encyptedPassword = encryptData(password,secret)
      const newCredential = await prisma.credential.create({
        data: {
          name,
          username,
          password: encyptedPassword,
          userId: tokenRes.body.user.id
        }
      })
      return Response.json({...newCredential,password}, {status: 201})
    })
}

export const PUT = async (req) => {
  return handle(req, async ({tokenRes}) => {
    const body = await req.json()
    const {name,username,password,id} = {name:body.name,username:body.username,password:body.password,id:body.id}
    if(!name || !username || !password){
      return Response.json("id, name, username, and password are required", {status: 400})
    }
    const encyptedPassword = encryptData(password,secret)
    const updatedCredential = await prisma.credential.update({
      where: {id, userId: tokenRes.body.user.id},
      data: {
        name,
        username,
        password: encyptedPassword,
        updatedAt: new Date()
      }
    })
    return Response.json({...updatedCredential,password}, {status: 200})
  })
}

export const DELETE = async (req) => {
  return handle(req, async ({tokenRes}) => {
    const body = await req.json()
    const {id} = {id:body.id}
    if(!id){
      return Response.json("id is required", {status: 400})
    }
    const deletedCredential = await prisma.credential.delete({
      where: {id, userId: tokenRes.body.user.id}
    })
    return Response.json(deletedCredential, {status: 200})
  })
}
