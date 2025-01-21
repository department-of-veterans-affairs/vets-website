export function decodeChars(string) {
  return string
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export function formatResponseString(string, stripAll = false) {
  if (stripAll) {
    return decodeChars(string.replace(/[\ue000\ue001]/g, ''));
  }

  return decodeChars(
    string.replace(/\ue000/g, '<strong>').replace(/\ue001/g, '</strong>'),
  );
}

export function truncateResponseString(string, maxLength) {
  if (string.length <= maxLength) {
    return string;
  }
  return `${string.slice(0, maxLength)}...`;
}

export function removeDoubleBars(string) {
  return string.replace(' | Veterans Affairs', '').replace(/&amp;/g, '&');
}
