const translations = {
    en: {
        title: "Welcome",
        header: "Welcome",
        description: "This is a multilingual demo"
    },
    es: {
        title: "Bienvenido",
        header: "Bienvenido!",
        description: "Esta es una demo..."
    },
    fr: {
        title: "Bienvenue",
        header: "Bienvenue!",
        description: "Ceci est une demo..."
    }
};

//Load lang from storage or default to 'en'
let currentLang = localStorage.getItem("lang") || "en";
applyLanguage(currentLang);

//Attach listeners to buttons
document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
        const selectedLang = button.getAttribute('data-lang');
        applyLanguage(selectedLang);
        localStorage.setItem("lang", selectedLang);
    });
});

//Core logic to update DOM
function applyLanguage(lang) {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(e1 => {
        const key = e1.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            e1.innerText = translations[lang][key];
        }
    });

    //Also update document title
    if (translations[lang] && translations[lang].title) {
        document.title = translations[lang].title;
    }
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartContainer = document.getElementById("cart");
const totalElement = document.getElementById("total");

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const product = button.closest(".product");
        const id = product.dataset.id;
        const name = product.dataset.name;
        const price = parseFloat(product.dataset.price);

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        }else {
            cart.push({ id, name, price, qty: 1 });
        }

        updateCart();
    });
});

function updateCart() {
    cartContainer.innerHTML = "";

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
           <span>${item.name}</span>
           <div class="qty-controls">
             <button class="qty-btn minus" data-index="${index}">-</button>
             <span>${item.qty}</span>

             <button class="qty-btn plus" data-index="${index}">+</button>
           </div>
           <span>$${itemTotal.toFixed(2)}</span>
           <button class="remove" data-index="${index}">X</button>
        `;
        cartContainer.appendChild(itemDiv);
    });

    totalElement.innerText = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));

    //Bind +/- buttons
    document.querySelectorAll(".qty-btn.plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart[index].qty++;
            updateCart();
        });
    });

    document.querySelectorAll(".qty-btn.minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart[index].qty--;
            if (cart[index].qty <= 0) cart.splice(index, 1);
            updateCart();
        });
    });

    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart.splice(index, 1);
            updateCart();
        });
    });

    document.getElementById("checkout-form").addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert("Your cart is empty. Add items before checking out.");
            return;
        }
            
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();

        if (!name || !email || !address) {
            alert("Please fill in all required fields.");
            return;
        }

        const summary = document.getElementById("order-summary");
        const total = document.getElementById("total").innerText;

        summary.innerHTML = `
           <h3>Order Placed!</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Address:</strong> ${address}</p>
           <p><strong>Order Total:</strong> ${total}</p>
           <p>Thank you for your purchase!</p>
        `;
        summary.style.display = "block";

        //Clear everything
        cart = [];
        updateCart();
        localStorage.removeItem("cart");
        this.reset();
    });
}

const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const productList = document.getElementById("product-list");

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    document.querySelectorAll(".product").forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const category = product.dataset.category;

        const matchesSearch = name.includes(searchText);
        const matchesCategory = selectedCategory === "all" || category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

//Initial load
updateCart();

axios.get('https://api.example.com/products')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

