import { validate } from "@/lib/utils"

export const POST = async (req) => {
  try{
    const tokenRes = await validate(req)
    if(!tokenRes.isValid){
      return Response.json(tokenRes.body, {status:tokenRes.status})
    }
    const body = await req.json()
    console.log(body)
    return Response.json("Creating Success", {status: 200})

  } catch(err){
    return Response.json("Internal Server Error", {status: 500})
  }
}
