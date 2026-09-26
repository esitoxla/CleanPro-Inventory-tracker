// Takes a product's base hex color and the current theme, and returns
// the correct shade to use for text/borders on that color. Light mode
// uses the base color as-is. Dark mode lightens it for contrast against
// dark surfaces, without changing the underlying hue.

export function getProductColor(baseHex, theme) {
  if (theme !== "dark") return baseHex;
  return lightenHex(baseHex, 20); // lighten by 20% in dark mode
}

function lightenHex(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);

  return (
    "#" +
    (r.toString(16).padStart(2, "0")) +
    (g.toString(16).padStart(2, "0")) +
    (b.toString(16).padStart(2, "0"))
  );
}
