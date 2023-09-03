// Api List
// Lookup full meal details by id : www.themealdb.com/api/json/v1/1/lookup.php?i=52772
// Lookup a single random meal : www.themealdb.com/api/json/v1/1/random.php
// List all meal categories : www.themealdb.com/api/json/v1/1/categories.php
// List all Categories : www.themealdb.com/api/json/v1/1/list.php?c=list
// List all Area : www.themealdb.com/api/json/v1/1/list.php?a=list
// List all Ingredients : www.themealdb.com/api/json/v1/1/list.php?i=list
// Filter by main ingredient : www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
// Filter by Category : www.themealdb.com/api/json/v1/1/filter.php?c=Seafood
// Filter by Area : www.themealdb.com/api/json/v1/1/filter.php?a=Canadian
// Ingredient Thumbnail Images : www.themealdb.com/images/ingredients/Lime.png,  www.themealdb.com/images/ingredients/Lime-Small.png

//  used var
let homeScreen = document.querySelector("#home-screen");
let searchSection = document.querySelector("#search");
//-----------------------------------------------------------Loding& Display Home Screen--------------------------------------------------------
$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});
//-----------------------------------------------------------Open&CloseSideNavBar--------------------------------------------------------
function closeNav() {
  // Close Nave
  let navWidth = $(".nav-content").outerWidth();
  $(".side-nav").animate({ left: -navWidth }, 800);

  // Change Icon to Bars
  $("i.open-icon").removeClass("fa-x");
  $("i.open-icon").addClass("fa-align-justify");

  // animate links down
  $(".nav-list ul li").animate({ top: "300px" }, 800);
}
closeNav();

function openNav() {
  // open nav
  $(".side-nav").animate({ left: 0 }, 500);

  // Change Icon to X
  $("i.open-icon").removeClass("fa-align-justify");
  $("i.open-icon").addClass("fa-x");

  // animate links Up in order
  for (let i = 0; i < 5; i++) {
    $(".nav-list li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}
$(".open-icon").click(() => {
  if ($(".side-nav").css("left") == "0px") {
    closeNav();
  } else {
    openNav();
  }
});
//--------------------------------------------------------------HomeScreen-------------------------------------------------------------
function displayHomeScreen(mealsArr) {
  // display meals in home screen
  let meal = "";
  for (let i = 0; i < mealsArr.length; i++) {
    meal += `
            <div class="col-md-3">
                <div onclick="mealDetails('${mealsArr[i].idMeal}')" id="meal" class="meal position-relative overflow-hidden rounded-2 ">
                    <img src="${mealsArr[i].strMealThumb}" class="w-100" loading="lazy">
                    <div class="meal-overlay position-absolute d-flex align-items-center p-2 text-black w-100 h-100">
                        <h3>${mealsArr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
  }

  homeScreen.innerHTML = meal;
}

//--------------------------------------------------------------SearchSection-------------------------------------------------------------
//---------------------------------------------------------------Display Search-----------------------------------------------------
function displaySearch() {
  searchSection.innerHTML = `
        <div class="row py-4">
        <div class="col-md-6">
            <input type="text" placeholder="Search By Name" class="search form-control bg-transparent text-white" id="byNameInput">
        </div>
        <div class="col-md-6">
            <input type="text" placeholder="Search By First Letter" class="search form-control bg-transparent text-white" maxlength = "1" id="byFirstLetterInput">
        </div>
        </div>
    `;
  homeScreen.innerHTML = "";
  // Show search results
  $("#byNameInput").keyup(function () {
    searchByName(this.value);
  });
  $("#byFirstLetterInput").keyup(function () {
    searchByFirstLetter(this.value);
  });
}
$("#search-link").click(() => {
  closeNav();
  displaySearch();
});

//---------------------------------------------------------------Search By Name----------------------------------------------------
async function searchByName(name) {
  closeNav();
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  response = await response.json();

  response.meals ? displayHomeScreen(response.meals) : displayHomeScreen([]);
  $("#pages-load").fadeOut(300);
}
//----------------------------------------------------------Search First Letter---------------------------------------------------
async function searchByFirstLetter(letter) {
  closeNav();
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);
  letter == "" ? (letter = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();

  response.meals ? displayHomeScreen(response.meals) : displayHomeScreen([]);
  $("#pages-load").fadeOut(300);
}
//--------------------------------------------------------------Meal Details-------------------------------------------------------------
async function mealDetails(idMeal) {
  closeNav();
  searchSection.innerHTML = "";
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
  );
  response = await response.json();

  displayMeal(response.meals[0]);
  $("#pages-load").fadeOut(300);
}

function displayMeal(meal) {
  let ingredient = "";
  for (let i = 0; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredient += `
            <li class="alert alert-info p-1 m-2">${meal[`strMeasure${i}`]} ${
        meal[`strIngredient${i}`]
      }</li>
        `;
    }
  }
  let tags = meal.strTags.split(",");

  let tag = "";
  for (let i = 0; i < tags.length; i++) {
    tag += `
            <li class="alert alert-danger p-1 m-2">${tags[i]}</li>
        `;
  }

  let mealDetail = `
        <div class="col-md-4">
            <img src="${meal.strMealThumb}" class="w-100 rounded-3" loading="lazy">
            <h2 class="mt-2">${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span> ${meal.strArea} </h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory} </h3>
            <h3 class="fw-bolder">Recipes : </h3>
            <ul class="list-unstyled d-flex flex-wrap g-3">
                ${ingredient}
            </ul>
            <h3 class="fw-bolder">Tags : </h3>
            <ul class="list-unstyled d-flex flex-wrap g-3">
                ${tag}
            </ul>
            <a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>
            <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
        </div>
    `;
  homeScreen.innerHTML = mealDetail;
}

//--------------------------------------------------------------CategoriesSection-------------------------------------------------------------

function displayCategory(cats) {
  let cat = "";
  for (let i = 0; i < cats.length; i++) {
    cat += `
        <div class="col-md-3">
        <div onclick="categoryMeals('${
          cats[i].strCategory
        }')" class="meal position-relative overflow-hidden rounded-2 ">
            <img src="${cats[i].strCategoryThumb}" class="w-100" loading="lazy">
            <div class="meal-overlay position-absolute text-center p-2 text-black w-100 h-100">
                <h3>${cats[i].strCategory}</h3>
                <p>${cats[i].strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
        </div>
    </div>
        `;
  }
  homeScreen.innerHTML = cat;
}
$("#Categories-link").click(() => {
  closeNav();
  categories();
});

async function categories() {
  homeScreen.innerHTML = "";
  searchSection.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();

  displayCategory(response.categories);
  $("#pages-load").fadeOut(300);
}

async function categoryMeals(cat) {
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
  );
  response = await response.json();

  displayHomeScreen(response.meals.slice(0, 20));
  $("#pages-load").fadeOut(300);
}
//--------------------------------------------------------------AreasSection-------------------------------------------------------------
function displayAreas(area) {
  let areas = "";

  for (let i = 0; i < area.length; i++) {
    areas += `
            <div class="col-md-3">
                <div onclick="areaMeals('${area[i].strArea}')" class="text-center">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${area[i].strArea}</h3>
                </div>
            </div>
        `;
  }
  homeScreen.innerHTML = areas;
}
$("#Areas-link").click(() => {
  closeNav();
  area();
});
async function area() {
  homeScreen.innerHTML = "";
  searchSection.innerHTML = "";
  $("#pages-load").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();

  displayAreas(response.meals);

  $("#pages-load").fadeOut(300);
}

async function areaMeals(area) {
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayHomeScreen(response.meals.slice(0, 20));

  $("#pages-load").fadeOut(300);
}
//--------------------------------------------------------------IngredientsSection-------------------------------------------------------------
function displayIngredients(ingrs) {
  let ingr = "";

  for (let i = 0; i < ingrs.length; i++) {
    ingr += `
            <div class="col-md-3">
                <div onclick="ingrMeals('${
                  ingrs[i].strIngredient
                }')" class="text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${ingrs[i].strIngredient}</h3>
                    <p>${ingrs[i].strDescription
                      .split(" ")
                      .slice(0, 20)
                      .join(" ")}</p>
                </div>
            </div>
        `;
  }
  homeScreen.innerHTML = ingr;
}

$("#Ingredients-link").click(() => {
  closeNav();
  ingredients();
});

async function ingredients() {
  homeScreen.innerHTML = "";
  searchSection.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngredients(response.meals.slice(0, 20));

  $("#pages-load").fadeOut(300);
}

async function ingrMeals(ingr) {
  homeScreen.innerHTML = "";
  $("#pages-load").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingr}`
  );
  response = await response.json();

  displayHomeScreen(response.meals.slice(0, 20));

  $("#pages-load").fadeOut(300);
}
//--------------------------------------------------------------ContactSection-------------------------------------------------------------
        //--------------------------------------------------------Validation--------------------------------------------


// let nameValidation = /^[a-zA-Z ]+$/.test($("#nameInput").value);

// let emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
//     $("#emailInput").value)

// let phoneValidation = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").value)

// let ageValidation = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").value)

// let passValidation = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passInput").value)

// function rePassValidation() {
//     return ($("#rePassInput").val == $("#passInput").val);
// }

// let nameFocused = false 
// let emailFocused = false 
// let phoneFocused = false 
// let ageFocused = false 
// let passFocused = false 
// let rePassFocused = false 

// $("#nameInput").focus(() => {
//     nameFocused = true; 
// });
// $("#emailInput").focus(() => {
//     emailFocused = true; 
// });
// $("#phoneInput").focus(() => {
//     phoneFocused = true; 
// });
// $("#ageInput").focus(() => {
//     ageFocused = true; 
// });
// $("#passInput").focus(() => {
//     passFocused = true; 
// });
// $("#rePassInput").focus(() => {
//     rePassFocused = true; 
// });

// function validation() {
//     if (nameFocused) {
//         if (nameValidation) {
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
//         }
//     }
//     if (emailFocused) {
//         if (emailValidation) {
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
//         }
//     }
//     if (phoneFocused) {
//         if(phoneValidation){
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
//         }
//     }
//     if (ageFocused) {
//         if(ageValidation){
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
//         }
//     }
//     if (passFocused) {
//         if(passValidation){
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
            
//         }
//     }
//     if (rePassFocused) {
//         if(rePassValidation){
//             $("#emailComment").removeClass("d-block");
//             $("#emailComment").addClass("d-none");
//         } else {
//             $("#emailComment").removeClass("d-none");
//             $("#emailComment").addClass("d-block");
//         }
//     }

//     //--------------------DisabledBtn--------------------

//     if (nameValidation && emailValidation && phoneValidation && ageValidation && passValidation && rePassValidation()) {
//         $("#submit").removeAttr("disabled");
//     } else {
//         $("#submit").attr("disabled", true);
//     }
// }
//     //--------------------showComments-------------------

//     $("#contact input").keyup(validation);

        //--------------------------------------------------------Validation--------------------------------------------
    
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.querySelector("#nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.querySelector("#emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.querySelector("#phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.querySelector("#ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.querySelector("#passwordInput").value))
}

function repasswordValidation() {
    return document.querySelector("#repasswordInput").value == document.querySelector("#passwordInput").value
}


let nameFocused = false 
let emailFocused = false 
let phoneFocused = false 
let ageFocused = false 
let passFocused = false 
let rePassFocused = false 

function contacts() {
    homeScreen.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="validation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameComment" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="validation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailComment" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="validation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneComment" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="validation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageComment" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="validation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passComment" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="validation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repassComment" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submit" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    

    $("#nameInput").focus(() => {
        nameFocused = true
    })
    $("#emailInput").focus(() => {
        emailFocused = true
    })

    $("#phoneInput").focus(() => {
        phoneFocused = true
    })

    $("#ageInput").focus(() => {
        ageFocused = true
    })
    $("#passwordInput").focus(() => {
        passFocused = true
    })
    $("#repasswordInput").focus(() => {
        rePassFocused = true
    })
    
}
$("#Contact-link").click(() => {
    closeNav()
    contacts()
})

function validation() {
    if (nameFocused) {
        if (nameValidation()) {
            $("#nameComment").removeClass("d-block");
            $("#nameComment").addClass("d-none");
        } else {
            $("#nameComment").removeClass("d-none");
            $("#nameComment").addClass("d-block");

        }
    }
    if (emailFocused) {

        if (emailValidation()) {
            $("#emailComment").removeClass("d-block");
            $("#emailComment").addClass("d-none");
        } else {
            $("#emailComment").removeClass("d-none");
            $("#emailComment").addClass("d-block");

        }
    }

    if (phoneFocused) {
        if (phoneValidation()) {
            $("#phoneComment").removeClass("d-block");
            $("#phoneComment").addClass("d-none");
        } else {
            $("#phoneComment").removeClass("d-none");
            $("#phoneComment").addClass("d-block");

        }
    }

    if (ageFocused) {
        if (ageValidation()) {
            $("#ageComment").removeClass("d-block");
            $("#ageComment").addClass("d-none");
        } else {
            $("#ageComment").removeClass("d-none");
            $("#ageComment").addClass("d-block");

        }
    }

    if (passFocused) {
        if (passwordValidation()) {
            $("#passComment").removeClass("d-block");
            $("#passComment").addClass("d-none");
        } else {
            $("#passComment").removeClass("d-none");
            $("#passComment").addClass("d-block");

        }
    }
    if (rePassFocused) {
        if (repasswordValidation()) {
            $("#repassComment").removeClass("d-block");
            $("#repassComment").addClass("d-none");
        } else {
            $("#repassComment").removeClass("d-none");
            $("#repassComment").addClass("d-block");

        }
    }


    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
        $("#submit").removeAttr("disabled");
    } else {
        $("#submit").attr("disabled", true);
    }
}

