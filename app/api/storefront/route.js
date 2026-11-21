import { getStorefront } from "../../lib/storefront";
export async function GET(request) {
  try {
    const data = await getStorefront({ fresh: new URL(request.url).searchParams.get("fresh") === "1" });
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "We couldn’t refresh the menu. Please try again before ordering." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
