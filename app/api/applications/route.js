import { decryptData, encryptData, handle } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const GET = async (req) => {
  return handle(req,["READ_APPS"], async ({tokenRes}) => {
    const applications = await prisma.application.findMany({where:{userId:tokenRes.body.user.id}})
    applications.forEach((application) => {
      application.password = decryptData(application.password,secret)
    })
    return Response.json(applications, {status: 200})
  })
}

export const POST = async (req) => {
    return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
      const body = await req.json()
      const {logo,name,address,type,login,password} = body
      console.log(body)
      if(!logo || !name || !address || !type || !login || !password){
        return Response.json("Bad Request", {status: 400})
      }
      console.log(tokenRes.body.user.id)
      const encyptedPassword = encryptData(password,secret)
      const newApplication = await prisma.application.create({
        data: {
          name,
          logo,
          login,
          type,
          address,
          password: encyptedPassword,
          userId: tokenRes.body.user.id
        }
      })
      return Response.json({...newApplication,password}, {status: 201})
    })
}

export const PUT = async (req) => {
  return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
    const body = await req.json()
    const {logo,name,address,type,login,password,id} = body
    if(!logo || !name || !address || !type || !login || !password || !id){
      return Response.json("Bad Request", {status: 400})
    }
    const encyptedPassword = encryptData(password,secret)
    const updatedApplication = await prisma.application.update({
      where: {id, userId: tokenRes.body.user.id},
      data: {
        name,
        logo,
        login,
        type,
        address,
        password: encyptedPassword,
        updatedAt: new Date()
      }
    })
    return Response.json({...updatedApplication,password}, {status: 202})
  })
}

export const DELETE = async (req) => {
  return handle(req,["WRITE_APPS"],async ({tokenRes}) => {
    const body = await req.json()
    const {id} = {id:body.id}
    if(!id){
      return Response.json("id is required", {status: 400})
    }
    const deletedApplication = await prisma.application.delete({
      where: {id, userId: tokenRes.body.user.id}
    })
    return Response.json(deletedApplication, {status: 200})
  })
}
