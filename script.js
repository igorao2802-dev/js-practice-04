/**
 * ДАННЫЕ ПРИЛОЖЕНИЯ
 */
const products = [
  {
    id: 1,
    name: "Ноутбук ASUS",
    category: "Электроника",
    price: 2500,
    inStock: true,
  },
  {
    id: 2,
    name: "Мышь Logitech",
    category: "Электроника",
    price: 45,
    inStock: true,
  },
  {
    id: 3,
    name: "Стол письменный",
    category: "Мебель",
    price: 320,
    inStock: false,
  },
  {
    id: 4,
    name: "Кресло офисное",
    category: "Мебель",
    price: 480,
    inStock: true,
  },
  {
    id: 5,
    name: "Наушники Sony",
    category: "Электроника",
    price: 180,
    inStock: true,
  },
  {
    id: 6,
    name: "Книга «JS для всех»",
    category: "Книги",
    price: 25,
    inStock: true,
  },
  {
    id: 7,
    name: "Книга «Clean Code»",
    category: "Книги",
    price: 30,
    inStock: false,
  },
  {
    id: 8,
    name: "Монитор LG 27''",
    category: "Электроника",
    price: 750,
    inStock: true,
  },
];

let cart = [];

/**
 * ЭЛЕМЕНТЫ DOM
 */
const catalogContainer = document.getElementById("catalog-container");
const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const filterResults = document.getElementById("filter-results");
const cartContainer = document.getElementById("cart-container");
const cartTotal = document.getElementById("cart-total");

/**
 * ФУНКЦИЯ ОТРИСОВКИ (Render)
 */
function renderCards(array, container) {
  container.innerHTML = "";

  if (array.length === 0) {
    container.innerHTML = '<p class="empty-state">Товары не найдены</p>';
    return;
  }

  // forEach: перебираю массив товаров, чтобы создать HTML-карточки
  // Использую forEach, потому что мне нужно просто пройтись по каждому товару
  // и создать для него элемент на странице. Новый массив не нужен.
  array.forEach((product) => {
    const card = document.createElement("div");
    card.className = `product-card ${!product.inStock ? "out-of-stock" : ""}`;

    card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Категория: ${product.category}</p>
            <p class="price">Цена: ${product.price} BYN</p>
            <p>${product.label || (product.inStock ? "✅ В наличии" : "❌ Нет в наличии")}</p>
            ${product.inStock ? `<button class="btn btn-cart" data-id="${product.id}">В корзину</button>` : ""}
        `;
    container.appendChild(card);
  });

  // forEach: нахожу все кнопки «В корзину» и каждой добавляю обработчик клика
  // Использую forEach, потому что нужно выполнить действие для каждой кнопки,
  // а не создать новый массив. Просто «прохожусь» по всем кнопкам.
  container.querySelectorAll(".btn-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.id)));
  });
}

/**
 * ЗАДАНИЕ 1: ВЫВОД КАТАЛОГА
 */
document.getElementById("btn-show-all").addEventListener("click", () => {
  renderCards(products, catalogContainer);
});

/**
 * ЗАДАНИЯ 2-3: ПОИСК И ФИЛЬТРАЦИЯ С ВАЛИДАЦИЕЙ
 */
document.getElementById("btn-search").addEventListener("click", () => {
  // ВАЛИДАЦИЯ ВВОДА:
  // 1. Очистка от пробелов (trim)
  const rawSearch = searchInput.value.trim();

  // 2. Проверка на пустой ввод (как в задаче 2 с логином)
  if (rawSearch === "" && categorySelect.value === "Все") {
    filterResults.innerHTML =
      '<p class="error" style="color:red">Введите поисковый запрос или выберите категорию</p>';
    return;
  }

  const searchTerm = rawSearch.toLowerCase();
  const selectedCategory = categorySelect.value;

  // filter: создаю новый массив только с теми товарами, которые подходят под поиск
  // Использую filter, потому что нужно отобрать часть товаров по условиям,
  // не изменяя исходный массив products. filter возвращает отфильтрованную копию.
  const filtered = products.filter((p) => {
    const matchCat =
      selectedCategory === "Все" || p.category === selectedCategory;
    const matchName = p.name.toLowerCase().includes(searchTerm);
    return matchCat && matchName;
  });

  // map: создаю новый массив товаров, добавляя каждому поле label с иконкой ⭐
  // Использую map, потому что нужно преобразовать каждый объект — добавить
  // новое свойство, сохранив все старые. map возвращает массив той же длины.
  const mapped = filtered.map((p) => ({
    ...p,
    label: `⭐ Доступно: ${p.name}`,
  }));

  renderCards(mapped, filterResults);
});

/**
 * ЗАДАНИЕ 4: КОРЗИНА С ЛОГИЧЕСКОЙ ВАЛИДАЦИЕЙ
 */
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  // ВАЛИДАЦИЯ ОПЕРАЦИИ:
  // 1. Проверка существования товара
  if (!product) return;

  // 2. Проверка наличия (защита от добавления через консоль/ошибки кода)
  if (!product.inStock) {
    console.error("Товар отсутствует на складе");
    return;
  }

  // 3. Проверка на дубликаты (метод some)
  const isExist = cart.some((item) => item.id === productId);
  if (isExist) {
    // Создаём элемент сообщения или выводим в существующий блок
    const statusDiv = document.getElementById("cart-status");
    if (statusDiv) {
      statusDiv.className = "status-message error";
      statusDiv.textContent = "Товар уже в корзине";
      statusDiv.style.display = "block";
      setTimeout(() => (statusDiv.style.display = "none"), 2000);
    }
    console.log("Товар уже в корзине");
    return;
  }

  cart.push(product);
  renderCart();
}

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="empty-state">Корзина пуста</p>';
    cartTotal.textContent = "";
    return;
  }

  // forEach: перебираю товары в корзине, чтобы показать их на странице
  // Использую forEach, потому что мне нужно для каждого товара создать
  // HTML-элемент и добавить его в блок корзины. Новый массив не нужен
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${item.name}</span> <span>${item.price} BYN</span>`;
    cartContainer.appendChild(div);
  });

  // map + reduce: подсчитываю итоговую сумму корзины
  // map: беру каждый товар и оставляю только его цену, в результате получаю массив чисел [2500, 45, 180]
  // reduce: беру все цены и складываю их в одно число, в результате получаю итоговую сумму
  // Использую эту цепочку, потому что задание требует показать работу обоих методов.
  const prices = cart.map((item) => item.price); // map: трансформация объектов в цены
  const total = prices.reduce((sum, price) => sum + price, 0); // reduce: агрегация
  cartTotal.textContent = `Итого: ${total.toFixed(2)} BYN`;
}

// Очистка корзины
document.getElementById("btn-clear-cart").addEventListener("click", () => {
  cart = [];
  renderCart();
});

// Кнопка "Показать корзину" (согласно ТЗ)
document.getElementById("btn-show-cart").addEventListener("click", renderCart);
