import { prismaClient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    // I want to use Google
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret : process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks:{
        async signIn(params) {
            if(!params.user.email){
                return false;
            }

            try{
                await prismaClient.user.upsert({
                    where : {
                        email : params.user.email
                    },
                    update : {},
                    create : {
                        email : params.user.email,
                        provider : "Google"
                    },
                });
            } catch(e) {
                console.log("Error creating user: ",e);
                return false;
            }
            
            return true;
        },
        async session({session}) {   
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
})

export {handler as GET, handler as POST}