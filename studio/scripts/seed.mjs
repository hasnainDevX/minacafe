import { readFile } from "node:fs/promises";
import { createClient } from "@sanity/client";
import { products, categories } from "../../app/assets/products.js";
import { productCutouts } from "../../app/assets/cutouts.js";
import { productImages } from "../../app/assets/index.js";
import { defaultSettings } from "../../app/lib/business.js";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("Set SANITY_API_WRITE_TOKEN locally before seeding. Never commit it.");
const client = createClient({ projectId: "ea5s4yve", dataset: "production", apiVersion: "2025-02-19", useCdn: false, token });
const categoryId = name => "category-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const upload = async path => {
 if (!path) return undefined;
 const asset = await client.assets.upload("image", await readFile(new URL("../../public" + path, import.meta.url)), { filename: path.split("/").pop() });
 return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
};
for (const [index, name] of categories.entries()) {
 const id = categoryId(name);
 if (!await client.getDocument(id)) {
  const product = products.find(p => p.category === name);
  await client.createIfNotExists({ _id:id,_type:"category",name,displayOrder:index,image:await upload(productImages[product?.id] || product?.image) });
 }
}
const featured = ["strawberry-milk-bottle","mango-milk-bottle","fresh-fruit-glass","chicken-salad-bowl","nut-and-nectar-cup","nut-and-nectar-bucket"];
for (const [index, p] of products.entries()) {
 if (await client.getDocument(p.id)) continue;
 const { id, variants, category, image, ...rest } = p;
 await client.createIfNotExists({ ...rest,_id:id,_type:"product",category:{_type:"reference",_ref:categoryId(category)},image:await upload(image || productCutouts[id]),imageFit:image ? "cover":"contain",categoryImage:await upload(productImages[id]),isAvailable:true,featured:featured.includes(id),displayOrder:index,variants:variants?.map(v => ({_key:v.id,_type:"object",label:v.label,price:v.price})) });
 console.log("Added " + p.name);
}
await client.createIfNotExists({_id:"business-settings",_type:"businessSettings",...defaultSettings,hours:defaultSettings.hours.map(row => ({...row,_key:"day-"+row.day,_type:"object"}))});
await client.createIfNotExists({_id:"homepage",_type:"homepage",announcement:"365 days of Mina — from stall to café."});
console.log("Seed complete. Existing documents were preserved.");
