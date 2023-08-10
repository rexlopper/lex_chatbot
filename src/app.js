/**
 * @fileoverview This file contains the main script file for the main html.
 * @author Rex Von Brixon Aparece Apa-ap
 * @version 1.0.0
 */

// Select The Elements
var toggle_btn;
var main_wrapper;
var mobile_menu;
let dark = false;

/**
 * Queries a selector everyone a new `clone` is added on top of the old one. Happens after changing theme.
 */
function set_selectors() {
  toggle_btn = document.querySelector(".toggle-btn");
  main_wrapper = document.querySelector(".main-wrapper");
  mobile_menu = document.querySelector(".hamburger-menu");
}

/**
 * Event listening to change theme.
 */
function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
  mobile_menu.addEventListener("click", () => {
    main_wrapper.classList.toggle("active");
  });
}

/**
 * Main tag query selector.
 */
const main = document.querySelector("main");

set_selectors();
events();

/**
 * Function to toggle animation. When the `toggle_btn`
 * element is clicked, this function is execution.
 */
function toggleAnimation() {
  dark = !dark;

  // creates another copy of the main wrapper
  let clone = main_wrapper.cloneNode(true);
  let remove_theme = dark? "light_theme" : "dark_theme";
  let add_theme = dark? "dark_theme" : "light_theme";

  clone.classList.remove(remove_theme)
  clone.classList.add(add_theme)
  
  // appends the copy of the main wrapper at the end
  clone.classList.add("clone");
  main.appendChild(clone);

  // prevents scrolling while animation
  document.body.classList.add("running-animation");

  clone.addEventListener("animationend", () => {
    // allow scroll
    document.body.classList.remove("running-animation");
    main_wrapper.remove();
    clone.classList.remove("clone");

    // reset variables
    set_selectors();
    events();
  });
}

