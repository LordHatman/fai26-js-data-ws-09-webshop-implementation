// Det här är vår fil. Här kopplar vi ihop datan och hjälpfunktionerna till nya funktioner på sidan.

// Datan från JSON-filerna.
import products from "./products.json" with { type: "json" };
import discountCodes from "./discount-codes.json" with { type: "json" };

// Hjälpfunktioner som räknar på eller ändrar datan. Läs mer i data-helpers.js.
import {
  findProduct,
  searchProducts,
  filterByCategory,
  sortProducts,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  getItemCount,
  getCartTotal,
  getShipping,
  getAmountLeftForFreeShipping,
  findDiscountCode,
  getDiscountAmount,
  toggleFavorite,
  getFavoriteProducts,
} from "./data-helpers.js";

// Hjälpfunktioner som visar saker på sidan eller lyssnar på det kunden gör. Läs mer i page-helpers.js.
import {
  showProducts,
  showCart,
  showCartCount,
  showCartSummary,
  showFreeShippingMessage,
  showDiscountMessage,
  showFavorites,
  getSearchText,
  getSelectedCategory,
  getSelectedSort,
  onButtonClick,
  onSearchInput,
  onCategoryChange,
  onSortChange,
  onDiscountSubmit,
} from "./page-helpers.js";

// ---------- Data som ändras medan sidan är öppen ----------

// Varukorgen. En array med rader: { id, name, price, quantity }.
let cart = [];

// Önskelistan. En array med produkternas id:n, till exempel [3, 7].
let favorites = [];

// Rabattkoden som kunden har använt. null betyder att ingen kod är använd än.
let activeDiscountCode = null;

// ---------- Våra funktioner ----------

// Här bygger vi.

// funktion: Kund lägger till vara i varukorgen - sidan uppdateras.
//identifiera vart funktionen addtocart bäst ska implementeras.

//funktion 1: Kunden väljer en annan sortering - vi ändrar ordningen och uppdaterar sidan

// ---------- Det som händer när sidan laddas ----------

showProducts(products, favorites);
showCart(cart);
showCartSummary(0, 0, 0);
showFavorites([]);
