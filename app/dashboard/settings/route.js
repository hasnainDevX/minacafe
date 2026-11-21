import { revalidateTag } from "next/cache";
import { isOwner, sameOrigin, privateHeaders } from "../../lib/dashboard-auth";
import { getStorefront, projectId, dataset } from "../../lib/storefront";
import { validatePaymentSettings, paymentFields } from "../../lib/payment-settings";
export async function GET() {
 if(!await isOwner())return Response.json({error:"Please sign in."},{status:401,headers:privateHeaders});
 try {const {settings}=await getStorefront({fresh:true,allowPreview:false});return Response.json({settings:Object.fromEntries([...paymentFields,"bankEnabled"].map(k=>[k,settings[k]??(k==="bankEnabled"?false:"")])),editable:Boolean(process.env.SANITY_API_WRITE_TOKEN)},{headers:privateHeaders});}
 catch{return Response.json({error:"Could not load business settings."},{status:503,headers:privateHeaders});}
}
export async function POST(request) {
 if(!await isOwner())return Response.json({error:"Please sign in."},{status:401,headers:privateHeaders});
 if(!sameOrigin(request))return Response.json({error:"Request not allowed."},{status:403,headers:privateHeaders});
 if(!process.env.SANITY_API_WRITE_TOKEN)return Response.json({error:"Saving will be available after the server’s Sanity write token is set."},{status:503,headers:privateHeaders});
 let settings;
 try {const body=await request.text();if(body.length>4096)throw Error("Request too large.");settings=validatePaymentSettings(JSON.parse(body));}
 catch(e){return Response.json({error:e.message},{status:400,headers:privateHeaders});}
 try {
  const response=await fetch("https://"+projectId+".api.sanity.io/v2025-02-19/data/mutate/"+dataset+"?visibility=sync",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.SANITY_API_WRITE_TOKEN},body:JSON.stringify({mutations:[{patch:{id:"business-settings",set:settings}}]}),cache:"no-store",signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error();
  revalidateTag("mina-storefront", {expire:0});
  return Response.json({ok:true},{headers:privateHeaders});
 }catch{return Response.json({error:"Could not save. Please try again."},{status:503,headers:privateHeaders});}
}