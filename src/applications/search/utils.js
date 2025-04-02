export function formatResponseString(string, stripAll = false) {
  const decodedString = string
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  if (stripAll) {
    return decodedString.replace(/[\ue000\ue001]/g, '');
  }

  return decodedString
    .replace(/\ue000/g, '<strong>')
    .replace(/\ue001/g, '</strong>');
}

export function truncateResponseString(string, maxLength) {
  if (string.length <= maxLength) {
    return string;
  }
  return `${string.slice(0, maxLength)}...`;
}

export function removeDoubleBars(string) {
  return string.replace(' | Veterans Affairs', '');
}
