export function decodeChars(string) {
  const entityMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&amp;': '&',
  };

  return string.replace(
    /&lt;|&gt;|&quot;|&#39;|&amp;/g,
    match => entityMap[match],
  );
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
  return string.replace(' | Veterans Affairs', '');
}
