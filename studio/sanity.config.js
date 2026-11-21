import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes.js";
const singletons = new Set(["businessSettings", "homepage"]);
export default defineConfig({
 name: "mina", title: "Mina Café", projectId: "ea5s4yve", dataset: "production",
 plugins: [structureTool({ structure: S => S.list().title("Mina Café").items([
  S.listItem().title("Products").child(S.documentTypeList("product").title("Products")),
  S.listItem().title("Categories").child(S.documentTypeList("category").title("Categories")),
  S.divider(),
  S.listItem().title("Business Settings").child(S.document().schemaType("businessSettings").documentId("business-settings")),
  S.listItem().title("Homepage").child(S.document().schemaType("homepage").documentId("homepage"))
 ]) })],
 schema: { types: schemaTypes, templates: templates => templates.filter(t => !singletons.has(t.schemaType)) },
 document: { actions: (actions, context) => singletons.has(context.schemaType) ? actions.filter(a => !["delete", "duplicate", "unpublish"].includes(a.action)) : actions }
});