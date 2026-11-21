import { NextResponse } from "next/server";
import { COOKIE, sameOrigin, loginAllowed, privateHeaders } from "../../lib/dashboard-auth";
import { authConfigured, passwordMatches, createSession, SESSION_SECONDS } from "../../lib/dashboard-crypto";
export async function POST(request) {
 if (!sameOrigin(request)) return NextResponse.json({error:"Request not allowed."},{status:403,headers:privateHeaders});
 if (!loginAllowed()) return NextResponse.json({error:"Too many attempts. Please wait a minute."},{status:429,headers:{...privateHeaders,"Retry-After":"60"}});
 if (!authConfigured()) return NextResponse.json({error:"Private access is not configured."},{status:503,headers:privateHeaders});
 if (Number(request.headers.get("content-length"))>2048) return NextResponse.json({error:"Invalid request."},{status:400,headers:privateHeaders});
 let password;try{const body=await request.text();if(body.length>2048)throw Error();password=JSON.parse(body).password;}catch{return NextResponse.json({error:"Invalid request."},{status:400,headers:privateHeaders});}
 if(!await passwordMatches(password))return NextResponse.json({error:"Incorrect password."},{status:401,headers:privateHeaders});
 const response=NextResponse.json({ok:true},{headers:privateHeaders});
 response.cookies.set(COOKIE,await createSession(),{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:SESSION_SECONDS});
 return response;
}