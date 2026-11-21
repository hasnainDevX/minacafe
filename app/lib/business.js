export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const defaultSettings = {
  whatsappNumber: "923402694079",
  jazzcashNumber: "",
  jazzcashAccountName: "",
  easypaisaNumber: "03402694079",
  easypaisaAccountName: "Kashmena",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankEnabled: false,
  ordersPaused: false,
  closureMessage: "",
  hours: DAYS.map((day, index) => ({ day: index, label: day, open: "16:00", close: "01:00", closed: false })),
  address: "Near Allied Bank, beyond SPAR supermarket, Block F, North Nazimabad, Karachi",
  mapsUrl: "https://maps.app.goo.gl/wjPkvrJnkTH7UC7KA",
  instagramUrl: "https://www.instagram.com/mina.cafe_/",
};

const minutes = (time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time || "") ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) : null;
export function formatTime(value) {
  const n = minutes(value);
  if (n === null) return "—";
  const h = Math.floor(n / 60);
  return `${h % 12 || 12}:${String(n % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// Karachi has UTC+05:00 with no DST. UTC methods avoid the visitor's timezone.
export function businessStatus(settings = defaultSettings, now = new Date()) {
  if (settings.ordersPaused) return { isOpen: false, message: settings.closureMessage || "Orders are paused for now. Please check back soon." };
  const local = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const day = local.getUTCDay();
  const minute = local.getUTCHours() * 60 + local.getUTCMinutes();
  const schedule = settings.hours || [];
  const intervals = [];
  for (let offset = -1; offset <= 7; offset++) {
    const row = schedule.find((h) => Number(h.day) === (day + offset + 7) % 7);
    if (!row || row.closed) continue;
    const start = minutes(row.open), end = minutes(row.close);
    if (start === null || end === null || start === end) continue;
    intervals.push({ start: offset * 1440 + start, end: offset * 1440 + end + (end < start ? 1440 : 0), offset, row });
  }
  const current = intervals.find((slot) => slot.start <= minute && minute < slot.end);
  if (current) return { isOpen: true, message: `Open until ${formatTime(current.row.close)} · Karachi time` };
  const next = intervals.find((slot) => slot.start > minute);
  if (!next) return { isOpen: false, message: "We’re currently closed. You can still place an order request, and we’ll contact you as soon as possible." };
  const when = next.offset === 0 ? "today" : next.offset === 1 ? "tomorrow" : DAYS[Number(next.row.day)];
  return { isOpen: false, message: `We’re currently closed. You can still place an order request, and we’ll contact you as soon as possible. Opens ${when} at ${formatTime(next.row.open)} · Karachi time` };
}

export function resolveCart(items, products) {
  return items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const variant = product?.variants?.find((v) => v.id === (item.variant || product.variants[0]?.id));
    const invalidVariant = Boolean(product?.variants?.length ? !variant : item.variant);
    const available = Boolean(product && product.isAvailable !== false && !invalidVariant);
    const price = variant?.price ?? product?.price ?? 0;
    return { ...item, product, variantInfo: variant, price, subtotal: price * item.quantity, available,
      issue: !product ? "This product is no longer on the menu." : invalidVariant ? "This option is no longer available." : product.isAvailable === false ? "Sold out" : "" };
  });
}

export function orderMessage(customer, lines, settings) {
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return ["MINA CAFÉ — ORDER REQUEST", ...(!businessStatus(settings).isOpen ? ["Placed outside café hours. Please contact me as soon as possible to confirm."] : []), "", `Name: ${customer.name.trim()}`, `WhatsApp: ${customer.phone.trim()}`,
    `Delivery address: ${customer.address.trim()}`, `Landmark: ${customer.landmark.trim()}`, "",
    ...lines.map((line) => `${line.quantity} × ${line.product.name}${line.variantInfo ? ` (${line.variantInfo.label})` : ""} — Rs. ${line.subtotal.toLocaleString("en-PK")}`),
    "", `Food total: Rs. ${total.toLocaleString("en-PK")}`,
    "Delivery: arranged by Mina via inDrive; rider fee paid separately to the rider.",
    customer.paymentMethod === "bank" ? `Bank transfer: ${settings.bankName} · ${settings.bankAccountName} · ${settings.bankAccountNumber}` : customer.paymentMethod === "easypaisa" ? `Easypaisa: ${settings.easypaisaAccountName} · ${settings.easypaisaNumber}` : settings.jazzcashNumber ? `JazzCash: ${settings.jazzcashAccountName} · ${settings.jazzcashNumber}` : "Please share your JazzCash account details for payment.",
    "I will send the payment screenshot here. Please verify payment and confirm my order.",
    ...(customer.notes?.trim() ? ["", `Notes: ${customer.notes.trim()}`] : [])].join("\n");
}
