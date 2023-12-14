function getDestinationDomain(href) {
  try {
    return new URL(href, document.location.href).hostname;
  } catch (e) {
    return '';
  }
}

export { getDestinationDomain };
