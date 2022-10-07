class Colour {
  constructor(hex, element) {
    this.hex = hex;
    this.element = element;
    this.locked = false;
  }

  setHex(hex) {
    this.hex = hex;
    this.element.style.backgroundColor = hex;
    this.element.querySelector(".colour-input").value = hex;
  }

  setLocked(locked) {
    this.locked = locked;

    if (locked) {
      this.element.querySelector(".lock-toggle").classList.add("is-locked");

      this.element.querySelector("img").src = "icons/lock-closed.svg";
    } else {
      this.element.querySelector(".lock-toggle").classList.remove("is-locked");

      this.element.querySelector("img").src = "icons/lock-open.svg";
    }
  }

  toggleLocked() {
    this.setLocked(!this.locked);
  }

  fetchHex(index) {
    if (this.locked) {
      return;
    }

    this.setHex(hexes[index]);
  }

  copyToClipboard() {
    const input = this.element.querySelector(".colour-input");
    input.select();
    document.execCommand("copy");
    input.blur();

    this.element.classList.add("copied");
    setTimeout(() => {
      this.element.classList.remove("copied");
    }, 1000);
  }
}

const colour_elements = document.querySelectorAll(".colours .colour");

let hexes = [];
const colours = [];

const generateHex = () => {
  const chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];
  }

  return color;
};

/*
 * hslToHex(): https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
 * hexToHsl(): https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
 * make addHue() function
*/

//currently editing algorithm to use color theory
const generateHexes = () => {
  hexes = [];
  hexes.push(generateHex());
  //complementary
  for (let i = 1; i < colour_elements.length; i++) {
    //let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    //let hueDiff = plusOrMinus * (Math.floor(Math.random() * 3) + 41)
    let hex = hexToHsl(hexes[0])
    hex['h'] += hueDiff;
    hexes.push(hex);
  }
};

generateHexes();

for (let i = 0; i < colour_elements.length; i++) {
  const colour_element = colour_elements[i];

  const input = colour_element.querySelector(".colour-input");
  const lock_toggle = colour_element.querySelector(".lock-toggle");
  const copy_btn = colour_element.querySelector(".copy-hex");

  const hex = input.value;

  const colour = new Colour(hex, colour_element);

  input.addEventListener("input", (e) => colour.setHex(e.target.value));
  lock_toggle.addEventListener("click", () => colour.toggleLocked());
  copy_btn.addEventListener("click", () => colour.copyToClipboard());

  colour.fetchHex(i);
  colours.push(colour);
}

document.querySelector(".generator-button").addEventListener("click", () => {
  generateHexes();
  for (let i = 0; i < colours.length; i++) {
    colours[i].fetchHex(i);
  }
});

document.addEventListener("keypress", (e) => {
  if (e.code.toLowerCase() === "space") {
    document.querySelector(".generator-button").click();
  }
});
