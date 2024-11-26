export default function rgbFromSeed(id) {
  // A simple hash function to generate a number from the ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure the hash is positive
  hash = Math.abs(hash);

  // Extract red, green, and blue components from the hash
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  return `rgb(${r}, ${g}, ${b})`;
}
