import { decryptData, isValidEmail, validatePassword } from "@/lib/utils"
import jwt from "jsonwebtoken"
import prisma from "@/prisma/prisma-client"

const secret = process.env.SECRET

export const POST = async (req) => {
  try{
    const body = await req.json()
    if(body.email === undefined || body.password === undefined){
      return Response.json("email and password are required", {status: 400})
    }
    if(isValidEmail(body.email) == false){
      return Response.json("Invalid Email", {status: 400})
    }
    if(!validatePassword(body.password).isValid){
      return Response.json(validatePassword(body.password).message, {status:400})
    }
    const FoundUser = await prisma.user.findFirst({where: {email: body.email},include:{role:true}})
    if(!FoundUser){
      return Response.json("User not found", {status: 404})
    }
    const match = (body.password == decryptData(FoundUser.password,secret))
    if(!match){
      return Response.json("Incorrect password", {status: 401})
    }
    const token = jwt.sign({id: FoundUser.id, roleId: FoundUser.role.id}, process.env.JWT_SECRET)
    await prisma.log.create({
      data: {
        userId: FoundUser.id,
        action: "LOGIN",
        message: `User: "${FoundUser.name}" logged in`
      }
    })
    return Response.json({user: {name:FoundUser.name, permissions:FoundUser.role.permissions, email:FoundUser.email}, token}, {status: 200})
  } catch(err){
    console.log(err)
    return Response.json("Internal Server Error", {status: 500})
  }
}


