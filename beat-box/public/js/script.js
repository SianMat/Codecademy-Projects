// Drum Arrays
let kicks = new Array(16).fill(false);
let snares = new Array(16).fill(false);
let hiHats = new Array(16).fill(false);
let rideCymbals = new Array(16).fill(false);

function toggleDrum(drum, index) {
  if (index >= 16 || index < 0) {
    return;
  }
  if (drum === "kicks") {
    kicks[index] = !kicks[index];
  } else if (drum === "snares") {
    snares[index] = !snares[index];
  } else if (drum === "hiHats") {
    hiHats[index] = !hiHats[index];
  } else if (drum === "rideCymbals") {
    rideCymbals[index] = !rideCymbals[index];
  }
}

function clear(drum) {
  if (drum === "kicks") {
    kicks = new Array(16).fill(false);
  } else if (drum === "snares") {
    snares = new Array(16).fill(false);
  } else if (drum === "hiHats") {
    hiHats = new Array(16).fill(false);
  } else if (drum === "rideCymbals") {
    rideCymbals = new Array(16).fill(false);
  }
}

function invert(drum) {
  if (drum === "kicks") {
    kicks = kicks.map((element) => !element);
  } else if (drum === "snares") {
    snares = snares.map((element) => !element);
  } else if (drum === "hiHats") {
    hiHats = hiHats.map((element) => !element);
  } else if (drum === "rideCymbals") {
    rideCymbals = rideCymbals.map((element) => !element);
  }
}
