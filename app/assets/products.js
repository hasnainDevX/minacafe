// Product names, prices and descriptions transcribed from the supplied Mina menu and owner messages.
export const products = [
  { id: "creamy-milk-bottle", name: "Creamy Milk", category: "Milk bottles", price: 200, description: "Rich, creamy milk with dry fruits and a malai-like texture." },
  { id: "strawberry-milk-bottle", name: "Strawberry Milk", category: "Milk bottles", price: 250, description: "Strawberry-flavoured milk with dry fruits and a creamy finish." },
  { id: "chocolate-milk-bottle", name: "Chocolate Milk", category: "Milk bottles", price: 250, description: "Chocolate-flavoured milk with dry fruits for a rich, creamy treat." },
  { id: "mango-milk-bottle", name: "Mango Milk", category: "Milk bottles", price: 250, description: "Creamy mango-flavoured milk with dry fruits." },
  { id: "fresh-fruit-glass", name: "Fresh Fruit Glass", category: "Fruit & bowls", price: 200, description: "A mix of seasonal fruits with your choice of topping. One topping is included; all three cost Rs.100 extra.", optionLabel: "Topping", variants: [{ id: "honey", label: "Honey", price: 200 }, { id: "condensed-milk", label: "Condensed milk", price: 200 }, { id: "chocolate", label: "Chocolate", price: 200 }, { id: "all-three", label: "All three toppings", price: 300 }] },
  { id: "chicken-salad-bowl", name: "Chicken Salad Bowl", category: "Fruit & bowls", price: 350, description: "A savoury bowl of chicken and fresh vegetables." },
  { id: "nut-and-nectar-mini-box", name: "Nut & Nectar Mini Box", category: "Nut & Nectar", price: 250, description: "Dry fruits coated with honey, in a compact mini box." },
  { id: "nut-and-nectar-cup", name: "Nut & Nectar Cup", category: "Nut & Nectar", price: 400, description: "Dry fruits coated with honey, served in a convenient cup." },
  { id: "nut-and-nectar-bucket", name: "Nut & Nectar Bucket", category: "Nut & Nectar", price: 1200, description: "A generous bucket of honey-coated dry fruits to enjoy together." },
  { id: "kashmiri-chai", name: "Kashmiri Chai", category: "Chai", price: 100, description: "Rich, aromatic and perfectly spiced.", image: "/images/products/stock/kashmiri-chai.webp", isNew: true, optionLabel: "Cup size", variants: [{ id: "small", label: "Small", price: 100 }, { id: "medium", label: "Medium", price: 200 }, { id: "large", label: "Large", price: 300 }] },
];
export const categories = ["Milk bottles", "Fruit & bowls", "Nut & Nectar", "Chai"];
