export function formatResponseString(string, stripAll = false) {
  if (stripAll) {
    return string.replace(/[\ue000\ue001]/g, '');
  }

  return string.replace(/\ue000/g, '<strong>').replace(/\ue001/g, '</strong>');
}

export function truncateResponseString(string, maxLength) {
  if (string.length <= maxLength) {
    return string;
  }
  return `${string.slice(0, maxLength)}...`;
}

export function removeDoubleBars(string) {
  return string.replace('| Veterans Affairs', '');
}

export function isSearchStrInvalid(str) {
  const formattedStr = str.trim();
  return !formattedStr.length || formattedStr.length > 255;
}
