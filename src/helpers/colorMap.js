export const productTextColors = {
  "Liquid Soap": "text-green-600 dark:text-green-400",
  "Floor Cleaner": "text-blue-600 dark:text-blue-400",
  Bleach: "text-yellow-600 dark:text-yellow-300",
  "Glass Cleaner": "text-cyan-600 dark:text-cyan-400",
  Softener: "text-pink-600 dark:text-pink-400",
};

//productTextColors[item.product]
//This looks up the color associated with the current product.
// returns the Tailwind CSS class that matches that product name.
// Example:

// If item.product = "Bleach", → returns "text-yellow-600"

// If item.product = "Softener", → returns "text-pink-600"
