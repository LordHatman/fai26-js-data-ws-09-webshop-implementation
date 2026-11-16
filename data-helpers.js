// Hjälpfunktioner som räknar på eller ändrar datan.
// De här funktionerna rör aldrig HTML. De tar emot data och ger tillbaka ett svar med return.
// Vi ändrar inte i den här filen. Vi importerar funktionerna i script.js och använder dem där.

const FREE_SHIPPING_LIMIT = 500;
const SHIPPING_PRICE = 49;

// ---------- Produkter ----------

// Hittar en produkt med hjälp av dess id.
// Ger tillbaka produktobjektet, eller undefined om ingen produkt har det id:t.
// Exempel: findProduct(products, 7) ger objektet för Vita sneakers.
// Tips: Användbar när vi bara vet id:t, till exempel när någon har klickat på en knapp i ett produktkort.
export const findProduct = (products, productId) => {
  return products.find((product) => {
    return product.id === productId;
  });
};

// Ger tillbaka de produkter vars namn innehåller söktexten. Stora och små bokstäver spelar ingen roll.
// En tom söktext ger tillbaka alla produkter.
// Exempel: searchProducts(products, "jeans") ger en array med Slim fit jeans.
// Tips: Användbar när kunden skriver i sökrutan.
export const searchProducts = (products, searchText) => {
  return products.filter((product) => {
    return product.name.toLowerCase().includes(searchText.toLowerCase());
  });
};

// Ger tillbaka produkterna i en kategori. Kategorin "alla" ger tillbaka alla produkter.
// Exempel: filterByCategory(products, "Skor") ger en array med två produkter.
// Tips: Användbar när kunden väljer kategori i menyn. Resultatet kan skickas vidare till en annan funktion,
// till exempel searchProducts, så att båda villkoren gäller samtidigt.
export const filterByCategory = (products, category) => {
  if (category === "alla") {
    return products;
  }

  return products.filter((product) => {
    return product.category === category;
  });
};

// Ger tillbaka en sorterad kopia av produkterna. Arrayen vi skickar in ändras inte.
// sortValue kan vara "standard", "pris-stigande", "pris-fallande" eller "namn".
// Exempel: sortProducts(products, "pris-stigande") ger den billigaste produkten först.
// Tips: Användbar när kunden väljer sortering i menyn.
export const sortProducts = (products, sortValue) => {
  if (sortValue === "pris-stigande") {
    return [...products].sort((a, b) => {
      return a.price - b.price;
    });
  }

  if (sortValue === "pris-fallande") {
    return [...products].sort((a, b) => {
      return b.price - a.price;
    });
  }

  if (sortValue === "namn") {
    return [...products].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  return [...products];
};

// ---------- Varukorgen ----------
// Varukorgen är en array med rader. Varje rad är ett objekt: { id, name, price, quantity }.
// Funktionerna nedan ändrar inte varukorgen vi skickar in. De ger tillbaka en ny varukorg.
// Därför sparar vi svaret i variabeln igen, till exempel: cart = removeFromCart(cart, 3);

// Lägger en produkt i varukorgen. Ligger produkten redan där ökar antalet med 1.
// Tar emot hela produktobjektet, inte bara id:t.
// Exempel: addToCart([], tshirt) ger [{ id: 1, name: "Basic t-shirt", price: 149, quantity: 1 }].
// Tips: Om vi bara har ett id kan vi först hitta produkten med findProduct.
export const addToCart = (cart, product) => {
  const existingLine = cart.find((line) => {
    return line.id === product.id;
  });

  if (existingLine === undefined) {
    return [
      ...cart,
      { id: product.id, name: product.name, price: product.price, quantity: 1 },
    ];
  }

  return cart.map((line) => {
    if (line.id === product.id) {
      return {
        id: line.id,
        name: line.name,
        price: line.price,
        quantity: line.quantity + 1,
      };
    }

    return line;
  });
};

// Minskar antalet av en produkt i varukorgen med 1. När antalet blir 0 försvinner raden.
// Exempel: om varukorgen har 2 st med id 3 ger decreaseQuantity(cart, 3) en varukorg med 1 st.
// Tips: Användbar för minus-knappen i varukorgen.
export const decreaseQuantity = (cart, productId) => {
  const updatedCart = cart.map((line) => {
    if (line.id === productId) {
      return {
        id: line.id,
        name: line.name,
        price: line.price,
        quantity: line.quantity - 1,
      };
    }

    return line;
  });

  return updatedCart.filter((line) => {
    return line.quantity > 0;
  });
};

// Tar bort en hel rad från varukorgen, oavsett hur många av produkten som ligger där.
// Exempel: removeFromCart(cart, 3) ger en varukorg utan produkten med id 3.
// Tips: Användbar för knappen Ta bort i varukorgen.
export const removeFromCart = (cart, productId) => {
  return cart.filter((line) => {
    return line.id !== productId;
  });
};

// Räknar ihop hur många varor som ligger i varukorgen.
// Exempel: 2 t-shirts och 1 keps ger 3.
// Tips: Användbar för siffran vid varukorgen högst upp på sidan.
export const getItemCount = (cart) => {
  return cart.reduce((count, line) => {
    return count + line.quantity;
  }, 0);
};

// Räknar ihop vad allt i varukorgen kostar tillsammans, före rabatt och frakt.
// Exempel: 2 t-shirts för 149 kr ger 298.
// Tips: Många andra funktioner behöver summan, till exempel getShipping och getDiscountAmount.
export const getCartTotal = (cart) => {
  return cart.reduce((sum, line) => {
    return sum + line.price * line.quantity;
  }, 0);
};

// Ger tillbaka vad frakten kostar för en viss summa. Från 500 kr är frakten gratis.
// En tom varukorg, alltså summan 0, har ingen frakt.
// Exempel: getShipping(298) ger 49. getShipping(599) ger 0.
export const getShipping = (total) => {
  if (total === 0 || total >= FREE_SHIPPING_LIMIT) {
    return 0;
  }

  return SHIPPING_PRICE;
};

// Ger tillbaka hur många kronor som fattas till fri frakt. Har vi redan fri frakt blir svaret 0.
// Exempel: getAmountLeftForFreeShipping(298) ger 202.
// Tips: Användbar tillsammans med showFreeShippingMessage.
export const getAmountLeftForFreeShipping = (total) => {
  if (total >= FREE_SHIPPING_LIMIT) {
    return 0;
  }

  return FREE_SHIPPING_LIMIT - total;
};

// ---------- Rabattkoder ----------

// Letar upp en rabattkod utifrån texten som kunden har skrivit.
// Mellanslag runt texten och stora eller små bokstäver spelar ingen roll.
// Ger tillbaka kodens objekt, till exempel { code: "VINTER10", percent: 10, minTotal: 0 },
// eller undefined om koden inte finns.
// Exempel: findDiscountCode(discountCodes, " vinter10 ") ger objektet för VINTER10.
export const findDiscountCode = (discountCodes, typedText) => {
  const cleanText = typedText.trim().toUpperCase();

  return discountCodes.find((discountCode) => {
    return discountCode.code === cleanText;
  });
};

// Räknar ut hur många kronor rabatt en kod ger på en viss summa. Svaret avrundas till hela kronor.
// Ger 0 om discountCode är null eller undefined, eller om summan är lägre än kodens minTotal.
// Exempel: med VINTER10 ger getDiscountAmount(298, vinterkoden) svaret 30.
// Tips: Rabatten behöver räknas ut på nytt varje gång varukorgen ändras, eftersom summan ändras.
export const getDiscountAmount = (total, discountCode) => {
  if (discountCode === null || discountCode === undefined) {
    return 0;
  }

  if (total < discountCode.minTotal) {
    return 0;
  }

  return Math.round((total * discountCode.percent) / 100);
};

// ---------- Önskelistan ----------
// Önskelistan är en array med id:n, till exempel [3, 7].

// Lägger till ett id på önskelistan, eller tar bort det om det redan finns där.
// Ger tillbaka en ny array. Därför skriver vi till exempel: favorites = toggleFavorite(favorites, 7);
// Exempel: toggleFavorite([3], 7) ger [3, 7]. toggleFavorite([3, 7], 7) ger [3].
// Tips: Användbar för hjärtknappen. Samma knapp lägger till och tar bort.
export const toggleFavorite = (favorites, productId) => {
  if (favorites.includes(productId)) {
    return favorites.filter((id) => {
      return id !== productId;
    });
  }

  return [...favorites, productId];
};

// Gör om önskelistans id:n till hela produktobjekt.
// Exempel: getFavoriteProducts(products, [3, 7]) ger objekten för Slim fit jeans och Vita sneakers.
// Tips: showFavorites vill ha produktobjekt, inte bara id:n.
export const getFavoriteProducts = (products, favorites) => {
  return products.filter((product) => {
    return favorites.includes(product.id);
  });
};
