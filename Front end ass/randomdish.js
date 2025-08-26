$(document).ready(function () {
  // Only show prompt if not dismissed in this session
  if (!sessionStorage.getItem("dismissDishPrompt")) {
    $("#dishPrompt").show();

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

  // Close button
  $("#closePrompt").on("click", function () {
    $("#dishPrompt").fadeOut();
    sessionStorage.setItem("dismissDishPrompt", "true");
  });
});
