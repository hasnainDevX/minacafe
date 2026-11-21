import test from "node:test";
import assert from "node:assert/strict";
import { businessStatus, defaultSettings, resolveCart, orderMessage } from "./business.js";
import { calculate } from "./calculator.js";
import { validatePaymentSettings, paymentFields } from "./payment-settings.js";
import { createCartStore } from "./cart-store.js";
const at = value => new Date(value);
test("Karachi schedule opens at 4 PM and closes at 1 AM, including Sunday", () => {
 for(const [time,open] of [["2026-11-22T10:59:59Z",false],["2026-11-22T11:00:00Z",true],["2026-11-22T19:59:59Z",true],["2026-11-22T20:00:00Z",false]])assert.equal(businessStatus(defaultSettings,at(time)).isOpen,open,time);
 assert.match(businessStatus(defaultSettings,at("2026-11-22T09:00:00Z")).message,/still place an order request/);
});
test("overnight carryover respects the previous day's hours",()=>{
 const settings={...defaultSettings,hours:defaultSettings.hours.map(row=>({...row,closed:row.day===0}))};
 assert.equal(businessStatus(settings,at("2026-11-21T19:30:00Z")).isOpen,true);
 assert.equal(businessStatus(settings,at("2026-11-22T11:30:00Z")).isOpen,false);
});
test("manual pause overrides normal opening and gives its own message",()=>{
 assert.deepEqual(businessStatus({...defaultSettings,ordersPaused:true,closureMessage:"Back tomorrow"},at("2026-11-22T12:00:00Z")),{isOpen:false,message:"Back tomorrow"});
});
const products=[{id:"tea",name:"Chai",price:100,isAvailable:true,variants:[{id:"small",label:"Small",price:100},{id:"large",label:"Large",price:300}]}];
test("cart resolves live prices and flags deleted products/options",()=>{
 const items=[{id:"tea",variant:"large",quantity:2},{id:"deleted",quantity:1}];
 let lines=resolveCart(items,products);
 assert.equal(lines[0].subtotal,600);assert.equal(lines[1].available,false);assert.match(lines[1].issue,/no longer/);
 lines=resolveCart(items,[{...products[0],variants:[{id:"large",label:"Large",price:350}]}]);
 assert.equal(lines[0].subtotal,700);
 assert.equal(resolveCart([{id:"tea",variant:"small",quantity:1}],[{...products[0],variants:[]}])[0].available,false);
 assert.equal(resolveCart(items,[{...products[0],isAvailable:false}])[0].available,false);
});
test("dynamic cart preserves deleted lines for an explanation and accepts newly published IDs",()=>{
 const data=new Map();const env={localStorage:{getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)},document:{cookie:""},location:{protocol:"https:"},addEventListener(){},removeEventListener(){}};
 const store=createCartStore(()=>env,{preserveMissing:true});
 store.setCatalog(products);store.add("tea","large");store.setCatalog([]);store.setQuantity("tea::large",2);
 assert.equal(store.getSnapshot()[0].quantity,2);
 const reload=createCartStore(()=>env,{preserveMissing:true});reload.initialize();assert.equal(reload.getSnapshot()[0].id,"tea");
});
test("WhatsApp message has current quantities, food total, delivery and manual verification",()=>{
 const lines=resolveCart([{id:"tea",variant:"large",quantity:2}],products);
 const text=orderMessage({name:" Customer ",phone:"03001234567",address:"Test address",landmark:"Near test shop",notes:"Less sugar",paymentMethod:"easypaisa"},lines,defaultSettings);
 for(const value of ["Customer","2 × Chai (Large)","Food total: Rs. 600","inDrive","paid separately","Kashmena","03402694079","verify payment","Less sugar"])assert.ok(text.includes(value),value);
 assert.ok(!text.includes("Order confirmed"));
});
test("calculator handles zeros, loss, targets and invalid values without NaN",()=>{
 assert.deepEqual(calculate({}),{revenue:0,expenses:0,profit:0,margin:null,aov:null,progress:null,remaining:null});
 const result=calculate({online:1000,offline:500,expenses:1800,orders:5,target:2000});
 assert.equal(result.profit,-300);assert.equal(result.margin,-20);assert.equal(result.aov,300);assert.equal(result.progress,75);assert.equal(result.remaining,500);
 assert.equal(calculate({online:"Infinity",offline:-8,expenses:"garbage"}).revenue,0);
});
test("payment settings allowlist values and normalize the Pakistani WhatsApp number",()=>{
 const input={...Object.fromEntries(paymentFields.map(k=>[k,""])),whatsappNumber:"0340 2694079",easypaisaNumber:"03402694079",easypaisaAccountName:"Kashmena",admin:true};
 const out=validatePaymentSettings(input);assert.equal(out.whatsappNumber,"923402694079");assert.equal(out.admin,undefined);
 assert.throws(()=>validatePaymentSettings({...input,easypaisaAccountName:""}));
 assert.throws(()=>validatePaymentSettings({...input,bankEnabled:true}));
 assert.throws(()=>validatePaymentSettings({...input,whatsappNumber:"bad"}));
});
