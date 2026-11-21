import { NextResponse } from "next/server";
import { COOKIE, isOwner, sameOrigin, privateHeaders } from "../../lib/dashboard-auth";
export async function POST(request) {
 if(!sameOrigin(request))return NextResponse.json({error:"Request not allowed."},{status:403,headers:privateHeaders});
 if(!await isOwner())return NextResponse.json({error:"Please sign in."},{status:401,headers:privateHeaders});
 const r=NextResponse.json({ok:true},{headers:privateHeaders});
 r.cookies.set(COOKIE,"",{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:0});
 return r;
}