// Hjälpfunktioner som visar saker på sidan eller lyssnar på det kunden gör.
// De här funktionerna räknar inte ut något själva. De visar det vi skickar in.
// Vi ändrar inte i den här filen. Vi importerar funktionerna i script.js och använder dem där.

const productList = document.querySelector("#product-list");
const productCount = document.querySelector("#product-count");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-select");
const sortSelect = document.querySelector("#sort-select");
const cartCount = document.querySelector("#cart-count");
const cartList = document.querySelector("#cart-list");
const cartSummary = document.querySelector("#cart-summary");
const freeShippingMessage = document.querySelector("#free-shipping-message");
const discountForm = document.querySelector("#discount-form");
const discountInput = document.querySelector("#discount-input");
const discountMessage = document.querySelector("#discount-message");
const favoritesCount = document.querySelector("#favorites-count");
const favoritesList = document.querySelector("#favorites-list");

// ---------- Visa saker på sidan ----------

// Visar produkterna som kort i produktlistan. Visar "Inga produkter hittades." om arrayen är tom.
// favorites är önskelistans id:n. Produkter som finns på önskelistan får ett fyllt hjärta.
// Varje kort har två knappar: name="add-to-cart" och name="favorite". Knapparnas value är produktens id.
// Exempel: showProducts(products, favorites).
export const showProducts = (products, favorites) => {
  productCount.textContent = `${products.length} produkter`;

  if (products.length === 0) {
    productList.innerHTML = `<p class="col-span-full py-10 text-center text-neutral-500">Inga produkter hittades.</p>`;
    return;
  }

  const cards = products.map((product) => {
    let heart = "♡";

    if (favorites.includes(product.id)) {
      heart = "♥";
    }

    return `
      <article class="flex flex-col">
        <div class="relative flex aspect-square items-center justify-center rounded-lg bg-neutral-100 text-7xl">
          ${product.emoji}
          <button
            name="favorite"
            value="${product.id}"
            aria-label="Spara ${product.name} på önskelistan"
            class="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white text-xl text-rose-600 shadow hover:scale-110"
          >${heart}</button>
        </div>
        <p class="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">${product.brand}</p>
        <h3 class="font-medium">${product.name}</h3>
        <p class="text-sm text-neutral-500">${product.color}</p>
        <p class="mt-1 font-semibold">${product.price} kr</p>
        <button
          name="add-to-cart"
          value="${product.id}"
          class="mt-3 rounded-md bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:bg-neutral-700"
        >Lägg i varukorgen</button>
      </article>
    `;
  });

  productList.innerHTML = cards.join("");
};

// Visar varukorgens rader. Visar "Varukorgen är tom." om varukorgen är tom.
// Varje rad har tre knappar: name="decrease" (−), name="increase" (+) och name="remove" (Ta bort).
// Knapparnas value är produktens id.
// Exempel: showCart(cart).
export const showCart = (cart) => {
  if (cart.length === 0) {
    cartList.innerHTML = `<li class="text-sm text-neutral-500">Varukorgen är tom.</li>`;
    return;
  }

  const rows = cart.map((line) => {
    return `
      <li class="text-sm">
        <div class="flex justify-between gap-2">
          <span class="font-medium">${line.name}</span>
          <span>${line.price * line.quantity} kr</span>
        </div>
        <div class="mt-1 flex items-center gap-2">
          <button name="decrease" value="${line.id}" class="size-7 rounded border border-neutral-300 hover:bg-neutral-100">−</button>
          <span class="w-5 text-center">${line.quantity}</span>
          <button name="increase" value="${line.id}" class="size-7 rounded border border-neutral-300 hover:bg-neutral-100">+</button>
          <button name="remove" value="${line.id}" class="ml-auto text-xs text-neutral-500 underline hover:text-rose-600">Ta bort</button>
        </div>
      </li>
    `;
  });

  cartList.innerHTML = rows.join("");
};

// Visar siffran vid varukorgen högst upp på sidan.
// Exempel: showCartCount(3).
export const showCartCount = (count) => {
  cartCount.textContent = count;
};

// Visar summan, rabatten, frakten och vad kunden ska betala.
// Raden för rabatt syns bara när discount är större än 0. Frakten 0 visas som "Fri frakt".
// Exempel: showCartSummary(298, 0, 49) visar Summa 298 kr, Frakt 49 kr och Att betala 347 kr.
// Tips: Funktionen räknar inte ut något själv. Vi räknar ut summa, rabatt och frakt först och skickar in dem.
export const showCartSummary = (total, discount, shipping) => {
  let shippingText = `${shipping} kr`;

  if (shipping === 0) {
    shippingText = "Fri frakt";
  }

  let discountRow = "";

  if (discount > 0) {
    discountRow = `<div class="flex justify-between text-emerald-700"><dt>Rabatt</dt><dd>−${discount} kr</dd></div>`;
  }

  cartSummary.innerHTML = `
    <div class="flex justify-between"><dt>Summa</dt><dd>${total} kr</dd></div>
    ${discountRow}
    <div class="flex justify-between"><dt>Frakt</dt><dd>${shippingText}</dd></div>
    <div class="flex justify-between text-base font-bold"><dt>Att betala</dt><dd>${total - discount + shipping} kr</dd></div>
  `;
};

// Visar hur mycket som fattas till fri frakt. Med 0 visas "Fri frakt!".
// Exempel: showFreeShippingMessage(202) visar "202 kr kvar till fri frakt".
// Tips: Räkna ut beloppet med getAmountLeftForFreeShipping.
export const showFreeShippingMessage = (amountLeft) => {
  if (amountLeft === 0) {
    freeShippingMessage.textContent = "Fri frakt!";
    freeShippingMessage.className =
      "mt-3 rounded-md bg-emerald-50 p-2 text-center text-sm font-semibold text-emerald-700";
    return;
  }

  freeShippingMessage.textContent = `${amountLeft} kr kvar till fri frakt`;
  freeShippingMessage.className =
    "mt-3 rounded-md bg-neutral-100 p-2 text-center text-sm";
};

// Visar ett meddelande under fältet för rabattkod. isError gör texten röd när den är true.
// Exempel: showDiscountMessage("VINTER10 är tillagd.", false) eller showDiscountMessage("Koden finns inte.", true).
export const showDiscountMessage = (text, isError) => {
  discountMessage.textContent = text;

  if (isError) {
    discountMessage.className = "mt-2 text-sm text-rose-600";
  } else {
    discountMessage.className = "mt-2 text-sm text-emerald-700";
  }
};

// Visar produkterna på önskelistan och antalet vid rubriken. Tar emot produktobjekt, inte id:n.
// Varje rad har två knappar: name="add-to-cart" och name="favorite". Knapparnas value är produktens id.
// Exempel: showFavorites(favoriteProducts).
// Tips: Knapparna har samma name som i produktkorten. Det som redan fungerar där fungerar alltså här också.
export const showFavorites = (favoriteProducts) => {
  favoritesCount.textContent = favoriteProducts.length;

  if (favoriteProducts.length === 0) {
    favoritesList.innerHTML = `<li class="text-sm text-neutral-500">Inga sparade produkter än.</li>`;
    return;
  }

  const rows = favoriteProducts.map((product) => {
    return `
      <li class="flex items-center gap-3 text-sm">
        <span class="text-2xl">${product.emoji}</span>
        <div class="flex-1">
          <p class="font-medium">${product.name}</p>
          <p class="text-neutral-500">${product.price} kr</p>
        </div>
        <button name="add-to-cart" value="${product.id}" class="rounded bg-neutral-900 px-2 py-1 text-xs font-semibold text-white">Köp</button>
        <button name="favorite" value="${product.id}" aria-label="Ta bort ${product.name} från önskelistan" class="text-lg text-rose-600">♥</button>
      </li>
    `;
  });

  favoritesList.innerHTML = rows.join("");
};

// ---------- Läsa av formulären ----------

// Ger tillbaka det som står i sökrutan just nu.
export const getSearchText = () => {
  return searchInput.value;
};

// Ger tillbaka kategorin som är vald just nu: "alla", "Kläder", "Skor" eller "Accessoarer".
export const getSelectedCategory = () => {
  return categorySelect.value;
};

// Ger tillbaka sorteringen som är vald just nu: "standard", "pris-stigande", "pris-fallande" eller "namn".
export const getSelectedSort = () => {
  return sortSelect.value;
};

// ---------- Lyssna på det kunden gör ----------

// Kör callbacken varje gång kunden klickar på en knapp med ett visst name.
// Callbacken får knappens value som ett tal, alltså produktens id.
// Knapparna på sidan heter "add-to-cart", "favorite", "decrease", "increase" och "remove".
// Exempel:
// onButtonClick("favorite", (productId) => {
//   console.log("Hjärtat klickades för produkt", productId);
// });
// Tips: Knapparna skapas om varje gång vi visar produkter eller varukorgen. Det gör inget,
// eftersom funktionen lyssnar på hela sidan. Vi behöver bara anropa onButtonClick en gång per name.
export const onButtonClick = (buttonName, callback) => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (button === null || button.name !== buttonName) {
      return;
    }

    callback(Number(button.value));
  });
};

// Kör callbacken varje gång kunden skriver i sökrutan. Callbacken får texten i sökrutan.
// Exempel: onSearchInput((searchText) => { console.log(searchText); });
export const onSearchInput = (callback) => {
  searchInput.addEventListener("input", () => {
    callback(searchInput.value);
  });
};

// Kör callbacken varje gång kunden väljer en kategori. Callbacken får den valda kategorin.
// Exempel: onCategoryChange((category) => { console.log(category); });
export const onCategoryChange = (callback) => {
  categorySelect.addEventListener("change", () => {
    callback(categorySelect.value);
  });
};

// Kör callbacken varje gång kunden väljer sortering. Callbacken får den valda sorteringen.
// Exempel: onSortChange((sortValue) => { console.log(sortValue); });
export const onSortChange = (callback) => {
  sortSelect.addEventListener("change", () => {
    callback(sortSelect.value);
  });
};

// Kör callbacken när kunden skickar formuläret för rabattkod. Callbacken får texten som kunden skrev.
// Funktionen stoppar sidan från att laddas om och tömmer fältet efteråt.
// Exempel: onDiscountSubmit((typedText) => { console.log(typedText); });
export const onDiscountSubmit = (callback) => {
  discountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    callback(discountInput.value);
    discountInput.value = "";
  });
};
