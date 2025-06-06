export function checkHeading(str) {
  // Match **Something** or * Something
  return /^(\*{1,2})(.*)(\*{1,2})$/.test(str.trim());
}

export function replaceHeadingStarts(str) {
  // Remove starting/ending * or **
  return str.replace(/^(\*{1,2})|(\*{1,2})$/g, '').trim();
}
