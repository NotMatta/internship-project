import prisma from "@/prisma/prisma-client"
import { handle } from "@/lib/utils"

export const GET = async (req) => {
  return await handle(req,["READ_ROLES"], async () => {
    const roles = await prisma.role.findMany()
    return Response.json(roles, {status: 200})
  })
}

export const POST = async (req) => {
  return await handle(req,["WRITE_ROLES"], async ({tokenRes}) => {
    const body = await req.json()
    const {name,permissions} = body
    if(!name || !permissions || permissions.includes("MASTER" || name == "MASTER")){
      return Response.json("Bad Request", {status: 400})
    }
    const newRole = await prisma.role.create({
      data: {
        name,
        permissions
      }
    })
    await prisma.log.create({
      data: {
        message: `Created new role: "${name}" by "${tokenRes.body.user.name}"`,
        action: "CREATE_ROLE",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json(newRole, {status: 201})
  })
}

export const PUT = async (req) => {
  return await handle(req,["WRITE_ROLES"], async ({tokenRes}) => {
    const body = await req.json()
    const {name,permissions,id} = body
    if(!name || !permissions || !id || permissions.includes("MASTER") || name == "MASTER"){
      return Response.json("Bad Request", {status: 400})
    }
    if(id == tokenRes.body.user.role.id){
      return Response.json("You can't edit your own role, use Another.", {status: 401})
    }
    const roleIsMaster = await prisma.user.findFirst({
      where:{
        name: "MASTER"
      }
    })
    if(roleIsMaster){
      return Response.json("Rejection", {status: 401})
    }
    const updatedRole = await prisma.role.update({
      where: {id},
      data: {
        name,
        permissions
      }
    })
    await prisma.log.create({
      data: {
        message: `Updated role: "${name}" by "${tokenRes.body.user.name}"`,
        action: "UPDATE_ROLE",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json(updatedRole, {status: 200})
  })
}

export const DELETE = async (req) => {
  return await handle(req,["WRITE_ROLES"], async ({tokenRes}) => {
    const body = await req.json()
    const {id} = body
    if(!id){
      return Response.json("Bad Request", {status: 400})
    }
    if(id == tokenRes.body.user.role.id){
      return Response.json("You can't delete your own role, use Another.", {status: 401})
    }
    const roleIsMaster = await prisma.user.findFirst({
      where:{
        name: "MASTER"
      }
    })
    if(roleIsMaster){
      return Response.json("Rejection", {status: 401})
    }
    const userWithRole = await prisma.user.findFirst({
      where:{
        roleId: id
      }
    })
    if(userWithRole){
      return Response.json("Role is in use", {status: 400})
    }

    const deletedRole = await prisma.role.delete({
      where: {id}
    })
    await prisma.log.create({
      data: {
        message: `Deleted role: "${deletedRole.name}" by "${tokenRes.body.user.name}"`,
        action: "DELETE_ROLE",
        userId: tokenRes.body.user.id
      }
    })
    return Response.json(deletedRole, {status: 200})
  })
}
