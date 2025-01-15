import prisma from "@/prisma/prisma-client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const POST = async (req) => {
  try{
    const body = await req.json()
    if(body.email === undefined || body.password === undefined){
      return Response.json("email and password are required", {status: 400})
    }
    const FoundUser = await prisma.user.findFirst({where: {email: body.email},include:{role:true}})
    if(!FoundUser){
      return Response.json("User not found", {status: 404})
    }
    const match = await bcrypt.compare(body.password, FoundUser.password)
    if(!match){
      return Response.json("Invalid password", {status: 401})
    }
    console.log(FoundUser)
    const token = jwt.sign({id: FoundUser.id, roleId: FoundUser.role.id}, process.env.JWT_SECRET)
    return Response.json({user: {name:FoundUser.name, role:FoundUser.role.name, email:FoundUser.email}, token}, {status: 200})
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error", {status: 500})
  }
}


