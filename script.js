
const TAX_RATE = 0.15;


const productList = document.getElementById("productList");
const productQuantity = document.getElementById("productQuantity");
const addToCartBtn = document.getElementById("addToCartBtn");
const cartItems = document.getElementById("cartItems");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const deliveryLocationSelect = document.getElementById("deliveryLocation");
const confirmOrderBtn = document.getElementById("confirmOrder");


const subtotalDisplay = document.getElementById("subtotalDisplay");
const taxDisplay = document.getElementById("taxDisplay");
const deliveryDisplay = document.getElementById("deliveryDisplay");
const discountRow = document.getElementById("discountRow");
const discountDisplay = document.getElementById("discountDisplay");
const totalPriceDisplay = document.getElementById("totalPriceDisplay");
const priceBreakdown = document.getElementById("priceBreakdown");


let cart = [];

addToCartBtn.addEventListener("click", addToCart);
deliveryLocationSelect.addEventListener("change", calculateTotalPrice);
confirmOrderBtn.addEventListener("click", confirmOrder);


function addToCart() {

  const selectedOption = productList.options[productList.selectedIndex];

 
  if (!selectedOption || selectedOption.value === "") {
    alert("Please select a product");
    return;
  }

  const productName = selectedOption.dataset.name;
  const productPrice = parseFloat(selectedOption.dataset.price);
  const quantity = parseInt(productQuantity.value);


  const existingProductIndex = cart.findIndex(
    (item) => item.name === productName
  );

  if (existingProductIndex > -1) {
 
    cart[existingProductIndex].quantity += quantity;
  } else {
   
    cart.push({
      name: productName,
      price: productPrice,
      quantity: quantity,
    });
  }


  updateCartDisplay();
  calculateTotalPrice();

  productList.selectedIndex = 0;
  productQuantity.value = 1;
}

function updateCartDisplay() {

  cartItems.innerHTML = "";

 
  emptyCartMessage.style.display = cart.length === 0 ? "block" : "none";

 
  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    const itemTotal = item.price * item.quantity;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} BDT</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" 
               class="quantity-input" data-index="${index}">
      </td>
      <td>${itemTotal} BDT</td>
      <td>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </td>
    `;

    cartItems.appendChild(row);
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeFromCart);
  });

  confirmOrderBtn.disabled = cart.length === 0;
}

function updateQuantity(event) {
  const index = event.target.dataset.index;
  const newQuantity = parseInt(event.target.value);

  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
    updateCartDisplay();
    calculateTotalPrice();
  }
}


function removeFromCart(event) {
  const index = event.target.dataset.index;
  cart.splice(index, 1);
  updateCartDisplay();
  calculateTotalPrice();
}


function calculateTotalPrice() {

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );


  const tax = subtotal * TAX_RATE;

  const deliveryFee = parseFloat(deliveryLocationSelect.value);

  const total = subtotal + tax + deliveryFee;

  subtotalDisplay.textContent = `${subtotal} BDT`;
  taxDisplay.textContent = `${tax.toFixed(2)} BDT`;
  deliveryDisplay.textContent = `${deliveryFee} BDT`;


  discountRow.style.display = "none";
  discountDisplay.textContent = "0 BDT";

  totalPriceDisplay.textContent = `${total.toFixed(2)} BDT`;
  priceBreakdown.style.display = "block";
}


function confirmOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to the cart before confirming.");
    return;
  }

  alert("Order Confirmed! Thank you for ordering.");


  cart = [];
  updateCartDisplay();
  calculateTotalPrice();
}
