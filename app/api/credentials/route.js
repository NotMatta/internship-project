import { handle } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

export const GET = async (req) => {
    return handle(req, async ({tokenRes}) => {
      const credentials = await prisma.credential.findMany({where:{userId:tokenRes.body.user.id}})
      return Response.json(credentials, {status: 200})
    })
}

export const POST = async (req) => {
    return handle(req, async ({tokenRes}) => {
      const body = await req.json()
      const {name,email,password} = {name:body.name,email:body.email,password:body.password}
      if(!name || !email || !password){
        return Response.json("name, email, and password are required", {status: 400})
      }
      console.log(tokenRes.body.user.id)
      const newCredential = await prisma.credential.create({
        data: {
          name,
          email,
          password,
          userId: tokenRes.body.user.id
        }
      })
      return Response.json(newCredential, {status: 201})
    })
}

export const PUT = async (req) => {
  return handle(req, async ({tokenRes}) => {
    const body = await req.json()
    const {name,email,password,id} = {name:body.name,email:body.email,password:body.password,id:body.id}
    if(!name || !email || !password){
      return Response.json("id, name, email, and password are required", {status: 400})
    }
    const updatedCredential = await prisma.credential.update({
      where: {id, userId: tokenRes.body.user.id},
      data: {
        name,
        email,
        password
      }
    })
    return Response.json(updatedCredential, {status: 200})
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
