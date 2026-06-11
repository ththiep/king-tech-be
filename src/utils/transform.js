export function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function keysToSnakeCase(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(keysToSnakeCase);
  return Object.keys(obj).reduce((acc, key) => {
    acc[toSnakeCase(key)] = keysToSnakeCase(obj[key]);
    return acc;
  }, {});
}

export function keysToCamelCase(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(keysToCamelCase);
  return Object.keys(obj).reduce((acc, key) => {
    acc[toCamelCase(key)] = keysToCamelCase(obj[key]);
    return acc;
  }, {});
}
