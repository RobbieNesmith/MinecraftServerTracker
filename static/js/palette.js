const palette = [[226, 145, 145],
[153, 221, 146],
[147, 216, 185],
[148, 196, 211],
[148, 154, 206],
[179, 148, 204],
[204, 150, 177],
[204, 164, 153],
[223, 229, 146],
[255, 165, 96],
[107, 255, 99],
[101, 255, 204],
[101, 196, 255],
[101, 107, 255],
[173, 101, 255],
[255, 101, 244],
[255, 101, 132],
[255, 101, 101]];

function getPalette() {
  return palette;
}

function getShuffledPalette() {
  let newPalette = palette;
  const paletteLength = newPalette.length;
  for (i = newPalette.length - 1; i > 0; i --) {
    const j = Math.floor(Math.random() * (paletteLength - 1));
    temp = newPalette[i];
    newPalette[i] = newPalette[j];
    newPalette[j] = temp;
  }
  return newPalette;
}
