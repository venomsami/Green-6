const categoryList = document.getElementById("category-list");
const treeCards = document.getElementById("tree-cards");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
const spinner = document.getElementById("spinner");

let total = 0;

// ========== Spinner Helpers ==========
function showSpinner() {
  spinner.classList.remove("hidden");
}
function hideSpinner() {
  spinner.classList.add("hidden");
}

// ========== Utility: Set Active Category ==========
function setActiveCategory(activeLi) {
  document.querySelectorAll("#category-list li").forEach(li =>
    li.classList.remove("active")
  );
  activeLi.classList.add("active");
}

// ========== Load Categories ==========
async function loadCategories() {
  showSpinner();
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const result = await res.json();

    categoryList.innerHTML = "";

    // Add "All Trees"
    const allLi = document.createElement("li");
    allLi.textContent = "All Trees";
    allLi.classList.add("category-item", "active");
    allLi.addEventListener("click", () => {
      setActiveCategory(allLi);
      loadAllPlants();
    });
    categoryList.appendChild(allLi);

    // Add categories from API
    result.categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.category_name;
      li.classList.add("category-item");
      li.addEventListener("click", () => {
        setActiveCategory(li);
        loadCategoryTrees(cat.id);
      });
      categoryList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    categoryList.innerHTML = "<li>Failed to load categories</li>";
  }
  hideSpinner();
}

// ========== Load All Plants ==========
async function loadAllPlants() {
  showSpinner();
  try {
    // Step 1: Fetch categories
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const result = await res.json();

    let allPlants = [];

    // Step 2: Fetch plants from each category
    for (const cat of result.categories) {
      const res2 = await fetch(`https://openapi.programming-hero.com/api/category/${cat.id}`);
      const data2 = await res2.json();
      if (data2.plants) {
        allPlants = allPlants.concat(data2.plants);
      }
    }

    // Step 3: Render everything together
    renderPlants(allPlants);
  } catch (err) {
    console.error("Error loading all plants:", err);
    treeCards.innerHTML = "<p>Failed to load plants.</p>";
  }
  hideSpinner();
}

// ========== Load Plants by Category ==========
async function loadCategoryTrees(id) {
  showSpinner();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    renderPlants(data.plants);
  } catch (err) {
    console.error("Error loading category plants:", err);
    treeCards.innerHTML = "<p>Failed to load plants.</p>";
  }
  hideSpinner();
}

// ========== Render Plant Cards ==========
function renderPlants(plants) {
  treeCards.innerHTML = "";

  if (!plants || plants.length === 0) {
    document.getElementById("empty-msg").classList.remove("hidden");
    return;
  } else {
    document.getElementById("empty-msg").classList.add("hidden");
  }

  plants.forEach(plant => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}">
      <h4 class="tree-name" data-id="${plant.id}">${plant.name}</h4>
      <p class="desc">${plant.description.substring(0, 60)}...</p>
      <p class="meta"><strong>Category:</strong> ${plant.category}</p>
      <div class="price-row">
        <span><strong>${plant.price} BDT</strong></span>
        <button class="add">Add to Cart</button>
      </div>
    `;

    // Modal on name click
    card.querySelector(".tree-name").addEventListener("click", () =>
      loadTreeDetail(plant.id)
    );

    // Add to cart
    card.querySelector(".add").addEventListener("click", () =>
      addToCart(plant)
    );

    treeCards.appendChild(card);
  });
}


// ========== Load Tree Detail in Modal ==========
async function loadTreeDetail(id) {
  showSpinner();
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();

    if (!data.plants) {
      modalBody.innerHTML = "<p>No plant details found.</p>";
    } else {
      const plant = data.plants;

      modalBody.innerHTML = `
        <h2>${plant.name}</h2>
        <img src="${plant.image}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
        <p>${plant.description}</p>
        <p><strong>Category:</strong> ${plant.category}</p>
        <p><strong>Price:</strong> ${plant.price} BDT</p>
      `;
    }

    modal.style.display = "flex";
  } catch (err) {
    console.error("Error loading plant details:", err);
    modalBody.innerHTML = "<p>Failed to load details.</p>";
    modal.style.display = "flex";
  }
  hideSpinner();
}


// ========== Add to Cart ==========
function addToCart(plant) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${plant.name} - ${plant.price} BDT 
    <span class="remove">❌</span>
  `;
  cartList.appendChild(li);

  total += plant.price;
  cartTotal.textContent = total;

  li.querySelector(".remove").addEventListener("click", () => {
    li.remove();
    total -= plant.price;
    cartTotal.textContent = total;
  });
}

// ========== Close Modal ==========
modalClose.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// ========== Init ==========
(async function init() {
  await loadCategories();
  await loadAllPlants(); // default load = All Trees
})();
