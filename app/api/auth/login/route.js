import prisma from "@/prisma/prisma-client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const POST = async (req) => {
  try{
    const body = await req.json()
    if(body.email === undefined || body.password === undefined){
      return Response.json("email and password are required", {status: 400})
    }
    const FoundUser = await prisma.user.findFirst({where: {email: body.email}})
    if(!FoundUser){
      return Response.json("User not found", {status: 404})
    }
    const match = await bcrypt.compare(body.password, FoundUser.password)
    if(!match){
      return Response.json("Invalid password", {status: 401})
    }
    const token = jwt.sign({id: FoundUser.id}, process.env.JWT_SECRET)
    return Response.json({user: FoundUser, token}, {status: 200})
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error", {status: 500})
  }
}


