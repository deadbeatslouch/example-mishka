var navMain = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");

var map = document.querySelector(".contacts__map");

var indexLink = document.querySelector(".product-best__order-button");
var catalogLink = document.querySelector(".product__order");
var popup = document.querySelector(".modal-cart")
var overlay = document.querySelector(".modal-overlay");

navMain.classList.remove("main-nav--nojs");

navToggle.addEventListener("click", function() {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
  }
});

map.classList.remove("contacts__map--nojs");

indexLink.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.add("modal-cart--show");
  overlay.classList.add("modal-overlay--show");
});

overlay.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.remove("modal-cart--show");
  overlay.classList.remove("modal-overlay--show");
});

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    if (popup.classList.contains("modal-cart--show")) {
      popup.classList.remove("modal-cart--show");
      overlay.classList.remove("modal-overlay--show");
    }
  }
});
