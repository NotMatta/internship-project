import { handleAdmin } from "@/lib/utils"
import { encryptData, decryptData } from "@/lib/utils"

const secret = process.env.SECRET

export const GET = async (req) => {
  return await handleAdmin(req, async () => {
    const users = await prisma.user.findMany()
    users.forEach((user) => {
      user.password = decryptData(user.password,secret)
    })
    return Response.json(users, {status: 200})
  })
}

export const POST = async (req) => {
  return await handleAdmin(req, async () => {
    const body = await req.json()
    const {name,email,password,roleId} = body
    if(!name || !email || !password || !roleId){
      console.log(name,email,password,roleId)
      return Response.json("Bad Request", {status: 400})
    }
    const encyptedPassword = encryptData(password,secret)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: encyptedPassword,
        roleId
      },
    })
    return Response.json({...newUser,password}, {status: 201})
  })
}

export const PUT = async (req) => {
  return await handleAdmin(req, async () => {
    const body = await req.json()
    const {id,name,email,password,roleId} = body
    if(!id || !name || !email || !password || !roleId){
      return Response.json("Bad Request", {status: 400})
    }
    const encyptedPassword = encryptData(password,secret)
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        email,
        password: encyptedPassword,
        roleId
      },
    })
    return Response.json({...updatedUser,password}, {status: 200})
  })
}

export const DELETE = async (req) => {
  return await handleAdmin(req, async () => {
    const { id } = await req.json()
    if(!id){
      return Response.json("Bad Request", {status: 400})
    }
    const deletedUser = await prisma.user.delete({
      where: { id: id },
    })
    return Response.json(deletedUser, {status: 200})
  })
}

