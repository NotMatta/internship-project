import { validatePassword, validateUsername, handle } from "@/lib/utils"
import bcrypt from "bcrypt"

export const POST = async (req) => {
    return handle(req, async ({tokenRes}) => {
      if(tokenRes.body.user.role.name != "ADMIN"){
        return Response.json("Unauthorized", {status: 401})
      }
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
      return Response.json({user:newUser}, {status: 201})
    })
} 
