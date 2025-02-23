import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try {
        const body = await req.json();
        const user = await currentUser();
        const {name,description,instructions,seed,src,catagoryId} = body;

        if(!user || !user.id || !user.firstName){
            return new NextResponse("Unauthorized Request",{status:401});
        }

        if(!src || !name || !description || !instructions || !seed || !catagoryId) {
            return new NextResponse("catagory " + catagoryId,{status:400});
        }


        const ispro = await checkSubscription();

        if(!ispro){
            return new NextResponse("Pro subscription is required",{status:403});
        }

        const companion = await prismadb.companion.create(
            {
                data:{
                    catagoryId,
                    userId:user.id,
                    userName:user.firstName,
                    name,
                    description,
                    src,
                    instructions,
                    seed
                }
            }
        )
        return NextResponse.json(companion);
    } catch (error) {
        console.log("companion_POST",error)
        return new NextResponse("Internal Server Error",{status:500});
    }
}