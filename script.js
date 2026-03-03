emailjs.init("6Kz2mcisW-wx8P3jV");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwxWOCSvoxlATw5doFMxqcc1u922BSXiVuzIkTC6wmaYnxKXL2lKHnPhrg-wBj2iwpM9A/exec";

/* ================= FOOD LIST ================= */
const foods = [
{name:"Mutton Kosha", category:"Main Course", price:350, image:"mutton-kosha.jpg"},
{name:"Panner Pasenda", category:"Main Course", price:280, image:"panner-pasenda.jpg"},
{name:"Chalkumro Patar Bhapa", category:"Main Course", price:220, image:"chalkumro-patar-bhapa.jpg"},
{name:"Mutton Rezala", category:"Main Course", price:370, image:"mutton-rezala.jpg"},
{name:"Mochar Kofta Kari", category:"Main Course", price:240, image:"mochar-kofta.jpg"},
{name:"Doodh Lau", category:"Main Course", price:190, image:"doodh-lau.jpg"},
{name:"Uche Aloo Posto", category:"Main Course", price:210, image:"uche-aloo-posto.jpg"},
{name:"Kaju Katla", category:"Main Course", price:400, image:"kaju-katla.jpg"},
{name:"Basanti Pulao", category:"Rice", price:230, image:"basanti-pulao.jpg"},
{name:"Fried Rice", category:"Rice", price:200, image:"fried-rice.jpg"},
{name:"Veg Biriyani", category:"Rice", price:210, image:"veg-biriyani.jpg"},
{name:"Panner Bharta", category:"Main Course", price:250, image:"panner-bharta.jpg"},
{name:"Nolen Gur Ice Cream", category:"Ice Cream", price:120, image:"nolen-gur-ice-cream.jpg"},
{name:"Chingri Macher Malai Kari", category:"Main Course", price:420, image:"chingri-malai-kari.jpg"},
{name:"Butter Nun", category:"Main Course", price:40, image:"butter-nun.jpg"},
{name:"Kashmiri Aloor Dom", category:"Main Course", price:230, image:"kashmiri-aloor-dom.jpg"},
{name:"Sahi Paneer", category:"Main Course", price:290, image:"sahi-paneer.jpg"},
{name:"Macher Matha Dea Badakopi", category:"Main Course", price:260, image:"macher-matha-badakopi.jpg"},
{name:"Potol er Dorman", category:"Main Course", price:240, image:"potol-dorman.jpg"},
{name:"Achor Chingri", category:"Main Course", price:390, image:"achor-chingri.jpg"}
];

let cart = [];
const cartSound = new Audio("sounds/add-to-cart.mp3");

/* ================= LOAD FOODS ================= */
function loadFoods(){
const container=document.getElementById("foodContainer");
container.innerHTML="";
foods.forEach(food=>{
container.innerHTML+=`
<div class="food-card">
<img src="images/foods/${food.image}">
<h3>${food.name}</h3>
<p>${food.category}</p>
<p>₹${food.price}</p>
<button onclick="addToCart('${food.name}',${food.price})">Add to Cart</button>
</div>`;
});
}
loadFoods();

/* ================= ADD TO CART ================= */
function addToCart(name,price){
cartSound.play();

let existing=cart.find(item=>item.name===name);
if(existing) existing.qty++;
else cart.push({name,price,qty:1});

updateCart();
}

/* ================= UPDATE CART ================= */
function updateCart(){
let cartItems=document.getElementById("cartItems");
cartItems.innerHTML="";
let total=0;
let count=0;

cart.forEach((item,i)=>{
total+=item.price*item.qty;
count+=item.qty;

cartItems.innerHTML+=`
<div style="margin-bottom:10px;">
${item.name} (${item.qty})
<button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
<button class="qty-btn" onclick="changeQty(${i},1)">+</button>
</div>`;
});

document.getElementById("totalAmount").innerText=total;
document.getElementById("bottomTotal").innerText=total;
document.getElementById("cartCount").innerText=count;
}

function changeQty(index,val){
cart[index].qty+=val;
if(cart[index].qty<=0) cart.splice(index,1);
updateCart();
}

function toggleCheckout(){
document.getElementById("checkoutPanel").classList.toggle("active");
}

function scrollToMenu(){
document.getElementById("menu").scrollIntoView({behavior:"smooth"});
}

/* ================= PROFESSIONAL PDF BILL ================= */
async function saveBill(){

let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let total=document.getElementById("totalAmount").innerText;

await fetch(GOOGLE_SCRIPT_URL,{
method:"POST",
body:JSON.stringify({name,phone,cart,total})
});

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

doc.setFont("helvetica","bold");
doc.setFontSize(22);
doc.text("BINA'S CLOUD KITCHEN",105,20,null,null,"center");

doc.setFontSize(12);
doc.setFont("helvetica","normal");
doc.text("Customer: "+name,20,40);
doc.text("Phone: "+phone,20,48);

doc.line(20,55,190,55);

let y=65;

cart.forEach(item=>{
doc.text(item.name,20,y);
doc.text("x"+item.qty,140,y);
doc.text("₹"+(item.price*item.qty),170,y);
y+=10;
});

doc.line(20,y,190,y);
y+=10;

doc.setFont("helvetica","bold");
doc.text("TOTAL: ₹"+total,150,y);

doc.save("Bina_Cloud_Kitchen_Bill.pdf");

alert("Professional Bill Generated & Google Sheet Updated!");
}

/* ================= PLACE ORDER ================= */
function placeOrder(){

let name=document.getElementById("name").value;
let address=document.getElementById("address").value;
let phone=document.getElementById("phone").value;
let total=document.getElementById("totalAmount").innerText;

emailjs.send("service_4615578","template_891060",{
customer_name:name,
customer_address:address,
customer_phone:phone,
order_details:JSON.stringify(cart),
total_amount:total
})
.then(()=>{
alert("Order Placed Successfully! Email Sent.");
});
}

/* ================= FILTER BY CATEGORY ================= */
function filterCategory(){

const selectedCategory = document.getElementById("categoryFilter").value;
const container = document.getElementById("foodContainer");
container.innerHTML = "";

foods.forEach(food => {

if(selectedCategory === "All" || food.category === selectedCategory){

container.innerHTML += `
<div class="food-card">
<img src="images/foods/${food.image}">
<h3>${food.name}</h3>
<p>${food.category}</p>
<p>₹${food.price}</p>
<button onclick="addToCart('${food.name}',${food.price})">Add to Cart</button>
</div>`;
}

});
}

/* ================= SEARCH FUNCTION ================= */
function searchFood(){

const searchValue = document.getElementById("searchBar").value.toLowerCase();
const container = document.getElementById("foodContainer");
container.innerHTML = "";

foods.forEach(food => {

if(food.name.toLowerCase().includes(searchValue)){

container.innerHTML += `
<div class="food-card">
<img src="images/foods/${food.image}">
<h3>${food.name}</h3>
<p>${food.category}</p>
<p>₹${food.price}</p>
<button onclick="addToCart('${food.name}',${food.price})">Add to Cart</button>
</div>`;
}

});
}

/* ================= ADVANCED SCROLL ANIMATION ================= */

function revealOnScroll(){

const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

reveals.forEach((element)=>{
const windowHeight = window.innerHeight;
const elementTop = element.getBoundingClientRect().top;
const revealPoint = 100;

if(elementTop < windowHeight - revealPoint){
element.classList.add("active");
}
});

const cards = document.querySelectorAll(".food-card");

cards.forEach((card, index)=>{
const windowHeight = window.innerHeight;
const elementTop = card.getBoundingClientRect().top;
const revealPoint = 100;

if(elementTop < windowHeight - revealPoint){
setTimeout(()=>{
card.classList.add("active");
}, index * 120);
}
});
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);