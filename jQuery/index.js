$("h1").addClass("big-title margin-50");

$("buttom").html();
$("img");
$("a").attr("href");

$("h1").click(function () {
  $("h1").css("color", "purple");
});

$("button").click(function () {
  $("h1").css("color", "purple");
});

$(document).keypress(function (event) {
  $("h1").text(event.key);
});

$(document).on("mouseover", function () {
  $("h1").css("color", "red");
});
$("button").on("click", function () {
  $("h1").animate({ opacity: 0.5 });
});
$("button").on("click", function () {
  $("h1").slideUp().slideDown().animate({ opacity: 0.5 });
});
