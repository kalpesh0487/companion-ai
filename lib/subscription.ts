import { auth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async() =>{
    const {userId} = await auth();

    if(!userId) return false;

    const userSubsription = await prismadb.userSubscription.findUnique({
        where:{
            userId:userId,
        },select:{
            stripeCurrentPeriodEnd:true,
            stripeCustomerId:true,
            stripePriceId:true,
            stripeSubscriptionId:true
        }
    })

    if(!userSubsription){
        return false;
    }

    const isvalid = userSubsription.stripePriceId && userSubsription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return !!isvalid;

}