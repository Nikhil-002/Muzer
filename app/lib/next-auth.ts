import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    // I want to use Google
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret : process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks:{
        async signIn({user}:any) {
            if(!user.email){
                return false;
            }

            try{
                await prismaClient.user.upsert({
                    where : {
                        email : user.email
                    },
                    update : {},
                    create : {
                        email : user.email,
                        provider : "Google"
                    },
                });
            } catch(e) {
                console.log("Error creating user: ",e);
                return false;
            }
            
            return true;
        },
        async session({session}: any) {   
            if(session?.user?.email){
                const dbUser = await prismaClient.user.findUnique({
                    where :{
                        email : session.user.email
                    }
                });
                if(dbUser){
                    (session.user as any).id = dbUser.id;
                }
            }
            return session;
        }
    }
}