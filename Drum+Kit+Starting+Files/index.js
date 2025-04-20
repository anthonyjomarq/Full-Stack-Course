var numberOfDrumButtons = document.querySelectorAll(".drum").length;
var audioCrash = new Audio("sounds/crash.mp3");
var audioKick = new Audio("sounds/kick-bass.mp3");
var audioTom1 = new Audio("sounds/tom-1.mp3");
var audioTom2 = new Audio("sounds/tom-2.mp3");
var audioTom3 = new Audio("sounds/tom-3.mp3");
var audioTom4 = new Audio("sounds/tom-4.mp3");
var audioSnare = new Audio("sounds/snare.mp3");

for (var i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);
  });
}
document.addEventListener("keydown", function (event) {
  makeSound(event.key);
  buttonAnimation(event.key);
});

function makeSound(key) {
  switch (key) {
    case "w":
      audioCrash.play();
      break;

    case "a":
      audioKick.play();
      break;

    case "s":
      audioTom1.play();
      break;

    case "d":
      audioTom2.play();
      break;

    case "j":
      audioTom3.play();
      break;

    case "k":
      audioTom4.play();
      break;

    case "l":
      audioSnare.play();
      break;

    default:
      console.log(buttonInnerHTML);
  }
}

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");

  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}
