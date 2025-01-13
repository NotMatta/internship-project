import { validatePassword, validateUsername } from "@/lib/utils"
import prisma from "@/prisma/prisma-client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const POST = async (req) => {
  try{
    const body = await req.json()
    if(body.email === undefined || body.password === undefined || body.name === undefined){
      return Response.json("email and password are required", {status: 400})
    }
    const {name,email,password} = {email:body.email,password:body.password,name:body.name}
    console.log("request body: ",body)
    if(validateUsername(name) !== "Username is valid."){
      return Response.json(validateUsername(name), {status: 400})
    }
    if(validatePassword(password) !== "Password is valid."){
      return Response.json(validatePassword(password), {status: 400})
    }
    const foundUser = await prisma.user.findFirst({where: {email}})
    if(foundUser){
      return Response.json("User already exists", {status: 400})
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword
      }
    })
    const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET)
    return Response.json({user:newUser,token}, {status: 201})
  } catch (error) {
    console.log("error",error)
    return Response.json("Internal Server Error", {status: 500})
  }
} 
