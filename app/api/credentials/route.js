import { validate } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const handle = async (req,handleFn) => {
  try{
    const tokenRes = await validate(req)
    if(!tokenRes.isValid){
      return Response.json(tokenRes.body, {status:tokenRes.status})
    }
    return await handleFn({req,tokenRes})
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error", {status: 500})
  }
}

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
