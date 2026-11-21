export const paymentFields = ["whatsappNumber","easypaisaNumber","easypaisaAccountName","jazzcashNumber","jazzcashAccountName","bankName","bankAccountName","bankAccountNumber"];
export function validatePaymentSettings(input) {
 if(!input || typeof input !== "object" || Array.isArray(input))throw Error("Invalid settings.");
 const result={};
 for(const field of paymentFields) {
  if(typeof input[field]!=="string" || input[field].length>100)throw Error("Please check the payment details.");
  result[field]=input[field].trim();
 }
 let phone=result.whatsappNumber.replace(/[\s()+-]/g,"");
 if(/^03\d{9}$/.test(phone))phone="92"+phone.slice(1);
 if(!/^92\d{10}$/.test(phone))throw Error("Enter a valid Pakistani WhatsApp number.");
 result.whatsappNumber=phone;
 for(const prefix of ["easypaisa","jazzcash"]) {
  const number=result[prefix+"Number"];
  if(number && !/^\+?[\d\s()-]{10,18}$/.test(number))throw Error("Enter a valid payment number.");
  if(number && !result[prefix+"AccountName"])throw Error("Please add the account holder name.");
 }
 result.bankEnabled=input.bankEnabled===true;
 if(result.bankEnabled && (!result.bankName || !result.bankAccountName || !result.bankAccountNumber))throw Error("Complete the bank details before enabling bank transfer.");
 return result;
}