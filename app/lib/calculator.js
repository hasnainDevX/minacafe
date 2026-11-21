export function calculate(values) {
 const number = key => Number.isFinite(Number(values[key])) ? Math.max(0, Math.min(1e9, Number(values[key]))) : 0;
 const revenue=number("online")+number("offline"), expenses=number("expenses"), profit=revenue-expenses;
 const orders=Math.floor(number("orders")), target=number("target");
 return {revenue,expenses,profit,margin:revenue?profit/revenue*100:null,aov:orders?revenue/orders:null,progress:target?revenue/target*100:null,remaining:target?Math.max(0,target-revenue):null};
}