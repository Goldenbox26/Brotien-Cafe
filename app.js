const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbx8byMKFTsoZIpRdGAptAZQFxY6e91GeUC2SKMhsozze_s3hg3fA4HQgpPIF_jl03ITtA/exec";

const WHATSAPP_NUMBER = "919133458116";

const menu = [
{
id:1,
name:"Protein Bowl",
price:249,
category:"healthy",
image:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
nutrition:{
calories:420,
protein:"32g",
carbs:"38g",
fat:"12g"
}
},
{
id:2,
name:"Matcha Smoothie",
price:179,
category:"healthy",
image:"https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800",
nutrition:{
calories:180,
protein:"14g",
carbs:"20g",
fat:"4g"
}
},
{
id:3,
name:"Loaded Burger",
price:299,
category:"comfort",
image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
nutrition:{
calories:650,
protein:"28g",
carbs:"45g",
fat:"32g"
}
},
{
id:4,
name:"Creamy Pasta",
price:269,
category:"comfort",
image:"https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
nutrition:{
calories:580,
protein:"18g",
carbs:"65g",
fat:"24g"
}
}
];

let cart = [];

renderMenu();

function renderMenu(){

const healthy = document.getElementById("healthyMenu");
const comfort = document.getElementById("comfortMenu");

menu.forEach(item=>{

const card = document.createElement("div");
card.className="food-card";

card.innerHTML=`
<img src="${item.image}" alt="${item.name}">
<div class="food-content">

<h3>${item.name}</h3>

<div class="price">₹${item.price}</div>

<div class="quantity">
<button onclick="changeQty(${item.id},-1)">-</button>
<span id="qty-${item.id}">1</span>
<button onclick="changeQty(${item.id},1)">+</button>
</div>

<div class="card-buttons">

<button class="btn secondary"
onclick="showNutrition(${item.id})">
Nutrition
</button>

<button class="btn primary"
onclick="addToCart(${item.id})">
Add
</button>

</div>

</div>
`;

if(item.category==="healthy"){
healthy.appendChild(card);
}else{
comfort.appendChild(card);
}

});
}

const quantities = {};

function changeQty(id,value){

quantities[id] = quantities[id] || 1;

quantities[id]+=value;

if(quantities[id] < 1){
quantities[id]=1;
}

document.getElementById(`qty-${id}`).innerText =
quantities[id];
}

function addToCart(id){

const item = menu.find(i=>i.id===id);

const qty = quantities[id] || 1;

cart.push({
...item,
qty
});

updateCartCount();
}

function updateCartCount(){

const count = cart.reduce(
(sum,item)=>sum+item.qty,
0
);

document.getElementById("cartCount").innerText =
count;
}

function showNutrition(id){

const item = menu.find(i=>i.id===id);

document.getElementById("nutritionTitle").innerText =
item.name;

document.getElementById("nutritionBody").innerHTML=`
<p><strong>Calories:</strong> ${item.nutrition.calories}</p>
<p><strong>Protein:</strong> ${item.nutrition.protein}</p>
<p><strong>Carbs:</strong> ${item.nutrition.carbs}</p>
<p><strong>Fat:</strong> ${item.nutrition.fat}</p>
`;

document.getElementById("nutritionModal").style.display =
"flex";
}

function closeNutrition(){
document.getElementById("nutritionModal").style.display =
"none";
}

function openCheckout(){

document.getElementById("checkoutModal").style.display =
"flex";

renderCart();
}

function closeCheckout(){

document.getElementById("checkoutModal").style.display =
"none";
}

function renderCart(){

const container =
document.getElementById("cartItems");

let total = 0;

container.innerHTML="";

cart.forEach(item=>{

const itemTotal =
item.price * item.qty;

total += itemTotal;

container.innerHTML += `
<div class="cart-item">
<span>
${item.name} x ${item.qty}
</span>
<span>
₹${itemTotal}
</span>
</div>
`;

});

document.getElementById("totalPrice").innerText =
total;
}

document
.getElementById("orderType")
.addEventListener("change",e=>{

const address =
document.getElementById("customerAddress");

if(e.target.value==="Delivery"){
address.required=true;
}else{
address.required=false;
}
});

document
.getElementById("checkoutForm")
.addEventListener("submit",async function(e){

e.preventDefault();

const name =
document.getElementById("customerName").value;

const phone =
document.getElementById("customerPhone").value;

const address =
document.getElementById("customerAddress").value;

const orderType =
document.getElementById("orderType").value;

let total = 0;

cart.forEach(item=>{
total += item.price * item.qty;
});

const orderItems = cart
.map(i=>`${i.name} x ${i.qty}`)
.join(", ");

const payload = {
name,
phone,
address,
orderType,
items:orderItems,
total
};

try{

await fetch(SCRIPT_URL,{
method:"POST",
mode:"no-cors",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});

}catch(err){
console.log(err);
}

const message =
`*BROTIEN CAFE ORDER*

Name: ${name}
Phone: ${phone}
Order Type: ${orderType}
Address: ${address}

Items:
${orderItems}

Total: ₹${total}

Payment Screenshot Attached`;

window.open(
`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
"_blank"
);

});

function scrollToMenu(){

window.scrollTo({
top:window.innerHeight,
behavior:"smooth"
});

}
