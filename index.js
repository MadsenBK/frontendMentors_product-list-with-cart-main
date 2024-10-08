const listEl = document.querySelector('#items');
const cartEl = document.querySelector(".cartItems");
const carTitleEl = document.querySelector(".cartTitle");
const cartTotalEl = document.querySelector("#cartTotal");
const cartBtmContinerEl = document.querySelector(".btmContainer")
const confOverlay = document.querySelector(".confContainer")
const confOverlayCart = document.querySelector(".cartSummary")
const confOverlayCartTotal = document.querySelector("#confCartTotal")
const confOverlayBgBlur =  document.querySelector(".blurOverlay")

const uid = (() => (id = 0, () => id++))();
const requestURL = './data.json';

let products;
let cart = [];
var cartQty = 0;
var cartTotal = 0;

async function getProducts () {
  const res = await fetch(requestURL)
  const data = await res.json()
  products = data

  confOverlay.style.display = "none"

  products.forEach(el => {
    let itmID = uid()
    listEl.insertAdjacentHTML('beforeend', `
      <div class="itemCard">
        <div class="itemImg">
          <picture>
            <source media="(min-width: 900px)" srcset="${el.image.desktop}" class="productImg">
            <source media="(min-width: 480px)" srcset="${el.image.tablet}" class="productImg">
            <img src="${el.image.mobile}" class="productImg">
          </picture>
          <button type="button" class="cartAddBtn" class="productImg" id="btn-${itmID}" onclick="addToCart(${itmID})">
                  <img src="/assets/images/icon-add-to-cart.svg" id="addCartBtn">
              <p>Add to Cart</p>
          </button>
          <button type="button" class="cartAddedBtn" id="btnInCart-${itmID}">
              <div class="chgQtyBtn" id="itmDecBtn-${itmID}" onclick = "decCart(${itmID})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>  
              </div>
              <p id="btnQty-${itmID}">QTY</p>
              <div class="chgQtyBtn" id="itmIncBtn-${itmID}" onclick = "addToCart(${itmID})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
              </div>
          </button>
        </div>
        <div class="itemInfo">
          <p class="itemInfoCategory">${el.category}</p>
          <p class="itemInfoName">${el.name}</p>
          <p class="itemInfoPrice">$${el.price.toFixed(2)}</p>
        </div>
      </div>`
    )
  });

}

getProducts();


function updateCart (clickedID) {


  if (cart.length === 0) {
    cartBtmContinerEl.style.visibility = "hidden"
    cartBtmContinerEl.style.height = "0px"
    carTitleEl.innerHTML = `Your Cart (${cartQty})`
    cartEl.style.alignItems = "center";
    cartEl.style.justifyContent = "space-evenly";

    cartEl.innerHTML = `
      <img class="cartPlacHolderImg" src="assets/images/illustration-empty-cart.svg">
      <p class="cartPlaceHolder">Your added items will appear here</p>
    `

  } else {

    cartEl.innerHTML=""

    cart.forEach(el => {

      cartEl.innerHTML += `
          <div class="cartItem">
            <span>
              <p id="cartItmName">${el.itemName}</p>
              <p class="cartItmPricing" id="cartItmQty">${el.itemQty}x     </p>
              <p class="cartItmPricing" id="cartItmUnitPrice">@ $${el.itemPrice}</p>
              <p class="cartItmPricing" id="cartItmUnitTotal">$${(el.itemQty * el.itemPrice).toFixed(2)}</p>
            </span>
            <button type="button" id="btn-remove-${el.itemID}" onclick="rmvCart(${el.itemID})">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
            </button>
        </div>`

    })

    carTitleEl.innerHTML = `
      Your Cart (${cartQty})
    `
    cartTotalEl.innerHTML = `
      $${cartTotal.toFixed(2)}
    `
    cartBtmContinerEl.style.visibility = "visible"
    cartBtmContinerEl.style.height = "200px"
  }

}

function chkQty(clickedID) {
  cart.forEach(el => {
    if (el.itemQty === 0) {
      let idToCartIdx = cart.findIndex(el => el.itemID === clickedID)
      cart.splice((idToCartIdx), 1)

      document.querySelector("#btn-" + el.itemID + ".cartAddBtn").style.visibility="visible"
      document.querySelector("#btnInCart-" + el.itemID + ".cartAddedBtn").style.visibility="hidden"

    }
  })

  updateCart(clickedID)
  
}

function addToCart(clickedID) {

  if (cart.some((item) => item.itemID === clickedID)) {
    let cartIndex = cart.findIndex((item) => item.itemID === clickedID)
    cart[cartIndex].itemQty = cart[cartIndex].itemQty + 1
  } else {
    cart.push({
      itemID: clickedID,
      itemName: products[clickedID].name,
      itemPrice: products[clickedID].price.toFixed(2),
      itemQty: 1,
      itemImg: products[clickedID].image
    });
  }


  cartQty ++;
  cartTotal = cartTotal + products[clickedID].price;

  document.querySelector("#btn-" + clickedID + ".cartAddBtn").style.visibility="hidden"
  document.querySelector("#btnInCart-" + clickedID + ".cartAddedBtn").style.visibility="visible"
 

  let idToCartItm = cart.find(el => el.itemID === clickedID)

  if (idToCartItm.itemQty === 0 && document.querySelector("#btnInCart-" + clickedID + ".cartAddedBtn").style.visibility === "visible") {
    document.querySelector("#btn-" + clickedID + ".cartAddBtn").style.visibility="visible"
    document.querySelector("#btnInCart-" + clickedID + ".cartAddedBtn").style.visibility="hidden"
  }

  document.querySelector("#btnQty-" + clickedID).innerHTML = idToCartItm.itemQty

  updateCart(clickedID);

};

function decCart(clickedID) {

  let cartIndex = cart.findIndex((item) => item.itemID === clickedID)
  let cartItem = cart.find((item) => item.itemID === clickedID)

  cart[cartIndex].itemQty = cart[cartIndex].itemQty - 1

  cartQty --;
  cartTotal = cartTotal - products[clickedID].price; 
  
  document.querySelector("#btnQty-" + clickedID).innerHTML = cartItem.itemQty

  chkQty(clickedID);
  
};

function rmvCart(clickedID) {

  let cartIndex = cart.findIndex((item) => item.itemID === clickedID)
  let cartItem = cart.find((item) => item.itemID === clickedID)

  cartQty = cartQty - cartItem.itemQty;
  cartTotal = cartTotal - (products[clickedID].price * cartItem.itemQty); 
  cart[cartIndex].itemQty = 0

  chkQty(clickedID);
  
}

function confirmCart() {

  cart.forEach(el => {
    confOverlayCart.innerHTML += `
      <div class="confCartContainer">
        <div class="confCartItem">
          <img src="${el.itemImg.thumbnail}" class="productImg">
          <span>
            <p id="cartItmName">${el.itemName}</p>
            <p class="cartItmPricing" id="cartItmQty">${el.itemQty}x     </p>
            <p class="cartItmPricing" id="cartItmUnitPrice">@ $${el.itemPrice}</p>
          </span>
          <div class="cartItmtTotalCnt">
            <p class="cartItmPricing" id="confCartItmUnitTotal">$${(el.itemQty * el.itemPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>`
  })

  confOverlayCartTotal.innerHTML = `$${cartTotal.toFixed(2)}`

  confOverlayBgBlur.style.visibility = "visible"
  confOverlay.style.display = "flex"
  window.scrollTo(0,0)
  document.body.style.overflow = "hidden"

  cart.forEach(el => {
    document.querySelector("#btn-" + el.itemID + ".cartAddBtn").style.visibility="visible"
    document.querySelector("#btnInCart-" + el.itemID + ".cartAddedBtn").style.visibility="hidden"
  });

  cart = [];
  cartQty = 0;
  cartTotal = 0;
  chkQty()
  updateCart();
 

}

function newOrder() {
  
  
  confOverlay.style.display = "none";
  confOverlayBgBlur.style.visibility = "hidden"
  document.body.style.overflow = "visible"
}