"use client";
import { useEffect, useState } from "react";
const fields = [["whatsappNumber","WhatsApp ordering number"],["easypaisaAccountName","Easypaisa account holder"],["easypaisaNumber","Easypaisa number"],["jazzcashAccountName","JazzCash account holder"],["jazzcashNumber","JazzCash number"],["bankName","Bank name"],["bankAccountName","Bank account holder"],["bankAccountNumber","Bank account / IBAN"]];
export default function SettingsEditor() {
  const [values,setValues]=useState(null),[editable,setEditable]=useState(false),[message,setMessage]=useState(""),[saving,setSaving]=useState(false);
  useEffect(() => {
    let alive=true;
    fetch("/dashboard/settings",{cache:"no-store"}).then(async r => {
      if(r.status===401){window.location.replace("/dashboard");return;}
      const data=await r.json(); if(!r.ok)throw Error(data.error);
      if(alive){setValues(data.settings);setEditable(data.editable);}
    }).catch(e=>{if(alive)setMessage(e.message);});
    return()=>{alive=false;};
  },[]);
  async function save(e) {
    e.preventDefault();setSaving(true);setMessage("");
    try {
      const r=await fetch("/dashboard/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(values)});
      const data=await r.json();if(!r.ok)throw Error(data.error);
      setMessage("Saved. Your payment and contact details are updated.");
    } catch(e){setMessage(e.message);}finally{setSaving(false);}
  }
  return <section className="my-12 bg-white p-6 md:p-9" aria-labelledby="settings-heading">
    <h2 id="settings-heading" className="font-(family-name:--font-cormorant) text-4xl font-light">Payment & contact details</h2>
    <p className="mt-3 text-sm">These details are shown to customers. Payments are verified manually.</p>
    {values && <form onSubmit={save} className="mt-8"><div className="grid gap-x-9 gap-y-6 md:grid-cols-2">{fields.map(([key,label])=>
      <label key={key}>{label}<input value={values[key]||""} onChange={e=>setValues(v=>({...v,[key]:e.target.value}))} maxLength={100} required={key==="whatsappNumber"} className="mt-2 block min-h-12 w-full border-b border-cocoa/30 bg-transparent" /></label>)}</div>
      <label className="mt-7 flex items-center gap-3"><input type="checkbox" checked={values.bankEnabled||false} onChange={e=>setValues(v=>({...v,bankEnabled:e.target.checked}))} />Show bank transfer details instead of “Coming soon”</label>
      <p className="mt-4 text-sm text-cocoa/65">Card payments remain coming soon until a payment gateway is connected.</p>
      {!editable && <p className="mt-4 text-sm">Saving will be available once the Sanity connection is completed.</p>}
      <button disabled={!editable||saving} className="mt-6 min-h-12 bg-burgundy px-7 py-3 text-white disabled:opacity-50">{saving?"Saving…":"Save details"}</button>
    </form>}
    <p role="status" className="mt-5 text-sm">{message}</p>
  </section>;
}
