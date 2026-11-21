// Use this entry instead of .open-next/worker.js at the final Cloudflare setup.
import worker from "../.open-next/worker.js";
const minaWorker = {
 async fetch(request,env,ctx) {
  if(new URL(request.url).pathname==="/dashboard/login" && request.method==="POST") {
   if(!env.DASHBOARD_LOGIN_LIMIT)return new Response("Login protection is not configured.",{status:503,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
   const ip=request.headers.get("CF-Connecting-IP") || "unknown";
   const {success}=await env.DASHBOARD_LOGIN_LIMIT.limit({key:ip});
   if(!success)return Response.json({error:"Too many attempts. Please wait a minute."},{status:429,headers:{"Retry-After":"60","Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
  return worker.fetch(request,env,ctx);
 }
};
export default minaWorker;
