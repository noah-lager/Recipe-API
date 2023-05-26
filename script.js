let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let currentContent = "categories"; 

function listCategories() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(response => response.json())
    .then(data => {
      let categories = data.categories;

      categories.sort((a, b) => a.strCategory.localeCompare(b.strCategory));

      let categoryList = document.getElementById("category-list");
      categoryList.innerHTML = "";

      categories.forEach(category => {
        let listItem = document.createElement("li");
        listItem.innerText = category.strCategory;
        listItem.addEventListener("click", () => {
          categoryFetch(category.strCategory);
        });
        categoryList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.log("Error", error);
    });
}

function categoryFetch(category) {
    // Hide result element
    result.innerHTML = "";
    result.style.display = "none";
  
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => {
        let meals = data.meals;
  
        meals.forEach(meal => {
          let mealDiv = document.createElement("div");
          mealDiv.className = "meal-item";
          mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
          `;
          mealDiv.addEventListener("click", () => {
            details(meal.idMeal);
          });
          result.appendChild(mealDiv);
        });
  
        currentContent = "categories";
        document.getElementById("items").style.display = "none";
        result.style.display = "flex";
      })
      .catch(error => {
        console.log("Error", error);
      });
  }
  

  function details(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        let myMeal = data.meals[0];
        let count = 1;
        let ingredients = [];
        for (let i in myMeal) {
          let ingredient = "";
          let measure = "";
          if (i.startsWith(`strIngredient`) && myMeal[i]) {
            ingredient = myMeal[i];
            measure = myMeal[`strMeasure` + count];
            count += 1;
            ingredients.push(`${measure} ${ingredient}`);
          }
        }
  
        result.innerHTML = `
          <img src=${myMeal.strMealThumb}>
          <div class="details">
            <h2>${myMeal.strMeal}</h2>
            <h4>${myMeal.strArea}</h4>
          </div>
          <div id="ingredient-con"></div>
          <div id="recipe">
            <button id="hide-recipe">X</button>
            <pre id="instructions">${myMeal.strInstructions}</pre>
          </div>
          <button id="show-recipe">View Recipe</button>
        `;
  
        let ingredientCon = document.getElementById("ingredient-con");
        let parent = document.createElement("ul");
        let recipe = document.getElementById("recipe");
        let hideRecipe = document.getElementById("hide-recipe");
        let showRecipe = document.getElementById("show-recipe");
  
        ingredients.forEach(i => {
          let child = document.createElement("li");
          child.innerText = i;
          parent.appendChild(child);
          ingredientCon.appendChild(parent);
        });
  
        hideRecipe.addEventListener("click", () => {
          recipe.style.display = "none";
        });
  
        showRecipe.addEventListener("click", () => {
          recipe.style.display = "block";
        });
  
        result.style.display = "block";
      })
      .catch(error => {
        console.log("Error:", error);
      });
  }

listCategories();

searchBtn.addEventListener('click', () => {
    let inputValue = document.getElementById('user-inp').value;
    let items = document.getElementById("items");
    items.innerHTML = "";

    result.style.display = "none";
  
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals == null) {
          document.getElementById("msg").style.display = "block";
        } else {
          document.getElementById("msg").style.display = "none";
          data.meals.forEach(meal => {
            let itemDiv = document.createElement("div");
            itemDiv.className = "m-2 singleItem";
            let itemInfo = `
              <div class="card"">
                <img src="${meal.strMealThumb}" class="" alt="...">
                <div class="">
                  <h5 class="">${meal.strMeal}</h5>
                </div>
              </div>
            `;
            itemDiv.innerHTML = itemInfo;
            itemDiv.querySelector('.card').addEventListener("click", () => {
              result.innerHTML = "";
              details(meal.idMeal);
            });
            items.appendChild(itemDiv);
          });
        }
  
        currentContent = "search";
        document.getElementById("category-list").style.display = "none";
        items.style.display = "block";
      })
      .catch(error => {
        console.log("Error", error);
      });
  });