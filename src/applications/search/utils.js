export function formatResponseString(string, stripAll = false) {
  if (stripAll) {
    return string.replace(/[\ue000\ue001]/g, '');
  }

  return string.replace(/\ue000/g, '<strong>').replace(/\ue001/g, '</strong>');
}
