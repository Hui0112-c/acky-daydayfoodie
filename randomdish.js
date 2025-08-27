$(document).ready(function () {

  function fetchRandomDish() {
    $.ajax({
      url: "https://www.themealdb.com/api/json/v1/1/filter.php?a=Malaysian",
      method: "GET",
      success: function (data) {
        const meals = data.meals;
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];

        $("#dishName").text(randomMeal.strMeal);
        $("#dishImage").attr("src", randomMeal.strMealThumb);

        $.ajax({
          url: "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + randomMeal.idMeal,
          method: "GET",
          success: function (detailData) {
            const meal = detailData.meals[0];
            $("#dishInstructions").text(meal.strInstructions.substring(0, 80) + "...");
            $("#dishLink").attr("href", meal.strSource || meal.strYoutube || "#");
          }
        });
      }
    });
  }

  // Fetch the random dish regardless of prompt visibility
  fetchRandomDish();

  // Only show the prompt if not dismissed
  if (!sessionStorage.getItem("dismissDishPrompt")) {
    $("#dishPrompt").show();
  }

  // Close button hides the prompt but doesn't stop fetching data
  $(document).on("click", "#closePrompt", function () {
    $("#dishPrompt").fadeOut();
    sessionStorage.setItem("dismissDishPrompt", "true");
  });

});
