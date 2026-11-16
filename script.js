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

// Funktion: Kunden lägger till en vara i varukorgen.

// ---------- Våra funktioner ----------

// TODO 1: Lägg till produkter i varukorgen.
// Använd findProduct och addToCart.
// Uppdatera varukorg, antal, totalsumma och frakt.

onButtonClick("add-to-cart", (productId) => {
  const product = findProduct(products, productId);

  if (product !== undefined) {
    cart = addToCart(cart, product);

    showCart(cart);
    showCartCount(getItemCount(cart));
  }
});

// TODO 2: Ändra antal och ta bort produkter.
// Hantera knapparna increase, decrease och remove.
// Skapa updateCart() för att uppdatera varukorgen efter varje ändring.

// Öka antalet med 1
onButtonClick("increase", (productId) => {
  const product = findProduct(products, productId);
  cart = addToCart(cart, product);

  showCart(cart);
  showCartCount(getItemCount(cart));
  showCartSummary(getCartTotal(cart), 0, getShipping(getCartTotal(cart)));
});

// Minska antalet med 1
onButtonClick("decrease", (productId) => {
  cart = decreaseQuantity(cart, productId);

  showCart(cart);
  showCartCount(getItemCount(cart));
  showCartSummary(getCartTotal(cart), 0, getShipping(getCartTotal(cart)));
});

// Ta bort produkten
onButtonClick("remove", (productId) => {
  cart = removeFromCart(cart, productId);

  showCart(cart);
  showCartCount(getItemCount(cart));
  showCartSummary(getCartTotal(cart), 0, getShipping(getCartTotal(cart)));
});

// TODO 3: Sök, filtrera och sortera produkter.
// Kombinera kategori, söktext och sortering.
// Uppdatera produktlistan när användaren ändrar något.

// Sök produkter
onSearchInput(() => {
  const filtered = filterByCategory(products, getSelectedCategory());
  const searched = searchProducts(filtered, getSearchText());
  const sorted = sortProducts(searched, getSelectedSort());

  showProducts(sorted, favorites);
});

// Filtrera efter kategori
onCategoryChange(() => {
  const filtered = filterByCategory(products, getSelectedCategory());
  const searched = searchProducts(filtered, getSearchText());
  const sorted = sortProducts(searched, getSelectedSort());

  showProducts(sorted, favorites);
});

// Sortera produkter
onSortChange(() => {
  const filtered = filterByCategory(products, getSelectedCategory());
  const searched = searchProducts(filtered, getSearchText());
  const sorted = sortProducts(searched, getSelectedSort());

  showProducts(sorted, favorites);
});

// TODO 4: Hantera rabattkoder.
// Kontrollera koden och visa felmeddelande vid ogiltig kod.
// Spara giltig kod i activeDiscountCode.
// Räkna om rabatten när varukorgen ändras.

onDiscountSubmit((typedText) => {
  const discountCode = findDiscountCode(discountCodes, typedText);

  if (discountCode === undefined) {
    showDiscountMessage("Rabattkoden finns inte.", true);
    return;
  }

  activeDiscountCode = discountCode;

  const total = getCartTotal(cart);
  const discount = getDiscountAmount(total, activeDiscountCode);
  const shipping = getShipping(total);

  if (total < discountCode.minTotal) {
    showDiscountMessage("Varukorgens summa är för låg för rabattkoden.", true);
  } else {
    showDiscountMessage("Rabattkoden har lagts till.", false);
  }

  showCartSummary(total, discount, shipping);
});

// TODO 5: Hantera önskelistan.
// Lägg till och ta bort favoriter med toggleFavorite.
// Uppdatera hjärtan, önskelista och antal.
// Koppla önskelistans Köp-knapp till varukorgen.

onButtonClick("favorite", (productId) => {
  favorites = toggleFavorite(favorites, productId);

  const favoriteProducts = getFavoriteProducts(products, favorites);

  showFavorites(favoriteProducts);

  const filtered = filterByCategory(products, getSelectedCategory());
  const searched = searchProducts(filtered, getSearchText());
  const sorted = sortProducts(searched, getSelectedSort());

  showProducts(sorted, favorites);
});

//funktion 1: Kunden väljer en annan sortering - vi ändrar ordningen och uppdaterar sidan

//Test fraktberäkning
console.log(getShipping(298));
console.log(getShipping(599));
// ---------- Det som händer när sidan laddas ----------

showProducts(products, favorites);
showCart(cart);
showCartSummary(0, 0, 0);
showFavorites([]);
