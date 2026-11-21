import { defineType, defineField } from "sanity";
const text = (name, title, extra = {}) => defineField({ name, title, type: "string", ...extra });
const price = (name = "price") => defineField({ name, title: "Price (PKR)", type: "number", validation: Rule => Rule.required().min(0).precision(2) });
const image = (name, title) => defineField({ name, title, type: "image", options: { hotspot: true } });
const order = defineField({ name: "displayOrder", title: "Display order", type: "number", initialValue: 0 });
const phone = (name, title) => text(name, title, { validation: Rule => Rule.regex(/^\+?[\d\s()-]{10,18}$/, { name: "phone number" }) });
export const schemaTypes = [
 defineType({ name: "category", title: "Category", type: "document", fields: [
  text("name", "Name", { validation: Rule => Rule.required() }), image("image", "Category photo"), order
 ], orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }] }),
 defineType({ name: "product", title: "Product", type: "document", fields: [
  text("name", "Name", { validation: Rule => Rule.required() }),
  defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: Rule => Rule.required().max(600) }),
  price(), image("image", "Product image"),
  text("imageFit", "Image style", { options: { list: [{title:"Transparent product (contain)",value:"contain"},{title:"Photo (cover)",value:"cover"}] }, initialValue: "contain" }),
  image("categoryImage", "Lifestyle photo (optional)"),
  defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }], validation: Rule => Rule.required() }),
  defineField({ name: "isAvailable", title: "Available to order", type: "boolean", initialValue: true, description: "Turn off only when this product is sold out." }),
  defineField({ name: "featured", title: "Show in Our Little Favourites", type: "boolean", initialValue: false }),
  defineField({ name: "isNew", title: "New product label", type: "boolean", initialValue: false }),
  order, text("optionLabel", "Option label", { description: "For example: Cup size or Topping" }),
  defineField({ name: "variants", title: "Sizes / options", type: "array", of: [{ type: "object", fields: [text("label", "Option name", { validation: Rule => Rule.required() }), price()], preview: { select: { title: "label", subtitle: "price" } } }] })
 ], preview: { select: { title: "name", media: "image", available: "isAvailable" }, prepare: ({ title, media, available }) => ({ title, media, subtitle: available === false ? "Sold out" : "Available" }) },
 orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }] }),
 defineType({ name: "businessSettings", title: "Business Settings", type: "document", fields: [
  phone("whatsappNumber", "WhatsApp ordering number (international format)"),
  phone("easypaisaNumber", "Easypaisa number"), text("easypaisaAccountName", "Easypaisa account holder"),
  phone("jazzcashNumber", "JazzCash number"), text("jazzcashAccountName", "JazzCash account holder"),
  text("bankName", "Bank name"), text("bankAccountName", "Bank account holder"), text("bankAccountNumber", "Bank account / IBAN"),
  defineField({ name: "bankEnabled", title: "Show bank transfer details", type: "boolean", initialValue: false }),
  defineField({ name: "ordersPaused", title: "Pause all order requests", type: "boolean", initialValue: false, description: "Opening hours alone do not disable requests. This switch does." }),
  text("closureMessage", "Pause message"),
  defineField({ name: "hours", title: "Weekly opening hours (Karachi)", type: "array", validation: Rule => Rule.required().length(7).custom(rows => !rows || new Set(rows.map(r => r.day)).size === 7 || "Each day must appear once."), of: [{ type: "object", fields: [
   defineField({ name: "day", title: "Day", type: "number", options: { list: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((title,value) => ({title,value})) }, validation: Rule => Rule.required() }),
   defineField({ name: "closed", title: "Closed", type: "boolean", initialValue: false }),
   text("open", "Opens (24-hour HH:mm)", { validation: Rule => Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/) }),
   text("close", "Closes (24-hour HH:mm)", { description: "01:00 means 1 AM the following day when opening at 16:00.", validation: Rule => Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/) })
  ], preview: { select: { day: "day", open: "open", close: "close", closed: "closed" }, prepare: v => ({ title: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][v.day], subtitle: v.closed ? "Closed" : v.open + " – " + v.close }) } }] }),
  text("address", "Address"), defineField({name:"mapsUrl",title:"Google Maps link",type:"url"}), defineField({name:"instagramUrl",title:"Instagram link",type:"url"})
 ] }),
 defineType({ name: "homepage", title: "Homepage", type: "document", fields: [
  text("announcement", "Announcement bar"), text("heroHeading", "Hero heading"), defineField({name:"heroDescription",title:"Hero description",type:"text",rows:3}),
  defineField({ name: "heroSlides", title: "Hero photos", type: "array", of: [{type:"object",fields:[image("image","Photo"),text("name","Description"),text("position","Crop position",{initialValue:"center center"})]}] })
 ] })
];