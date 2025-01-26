import { handle } from "@/lib/utils"
import { encryptData, decryptData } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const GET = async (req) => {
  return await handle(req,["READ_USERS"],async () => {
    const users = await prisma.user.findMany({include:{role:true}})
    users.forEach((user) => {
      user.password = decryptData(user.password,secret)
    })
    return Response.json(users, {status: 200})
  })
}

export const POST = async (req) => {
  return await handle(req,["WRITE_USERS"], async ({tokenRes}) => {
    const body = await req.json()
    const {name,email,password,roleId} = body
    if(!name || !email || !password || !roleId){
      console.log(name,email,password,roleId)
      return Response.json("Bad Request", {status: 400})
    }
    const roleIsMaster = await prisma.role.findFirst({
      where:{
        id: roleId
      }
    })
    if(roleIsMaster.name == "MASTER"){
      return Response.json("Rejection", {status: 401})
    }
    const encyptedPassword = encryptData(password,secret)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encyptedPassword,
        roleId
      },include:{role:true}
    })
    await prisma.log.create({
      data: {
        message: `Created new user: "${name}" by "${tokenRes.body.user.name}"`,
        action: "CREATE_USER",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json({...newUser,password}, {status: 201})
  })
}

export const PUT = async (req) => {
  return await handle(req,["WRITE_USERS"], async ({tokenRes}) => {
    const body = await req.json()
    const {id,name,email,password,roleId} = body
    if(!id || !name || !email || !password || !roleId){
      return Response.json("Bad Request", {status: 400})
    }
    if(id == tokenRes.body.user.id){
      return Response.json("You can't edit your own account, use Another.", {status: 401})
    }
    const user = await prisma.user.findFirst({where:{id},include:{role:true}})
    if(user.role.name == "MASTER"){
      return Response.json("Rejection", {status: 401})
    }
    const roleIsMaster = await prisma.role.findFirst({
      where:{
        id: roleId
      }
    })
    if(roleIsMaster.name == "MASTER"){
      return Response.json("Rejection", {status: 401})
    }
    const encyptedPassword = encryptData(password,secret)
    const updatedUser = await prisma.user.update({
      where: {id},
      data: {
        name,
        email,
        password: encyptedPassword,
        roleId
      },include:{role:true}
    })
    await prisma.log.create({
      data: {
        message: `Updated user: "${name}" by "${tokenRes.body.user.name}"`,
        action: "UPDATE_USER",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json({...updatedUser,password}, {status: 200})
  })
}

export const DELETE = async (req) => {
  return await handle(req,["WRITE_USERS"], async ({tokenRes}) => {
    const { id } = await req.json()
    if(!id){
      return Response.json("Bad Request", {status: 400})
    }
    if(id == tokenRes.body.user.id){
      return Response.json("You can't delete your own account, use Another.", {status: 401})
    }
    const FoundUser = await prisma.user.findFirst({where:{id},include:{role:true}})
    if(FoundUser.role.name == "MASTER"){
      return Response.json("Rejection", {status: 401})
    }
    await prisma.application.deleteMany({
      where: { userId: id },
    })
    const deletedUser = await prisma.user.delete({
      where: {id },
    })
    await prisma.log.create({
      data: {
        message: `Deleted user: "${deletedUser.name}" by: "${tokenRes.body.user.name}"`,
        action: "DELETE_USER",
        userId: tokenRes.body.user.id,
      }
    })
    return Response.json(deletedUser, {status: 200})
  })
}

