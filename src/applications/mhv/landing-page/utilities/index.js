function getDestinationDomain(href) {
  const url = new URL(href, document.location.href);

  const { hostname } = url;

  if (hostname.includes('va.gov')) {
    return 'va.gov';
  }
  if (hostname.includes('mhvnp')) {
    return 'mhvnp';
  }

  return hostname;
}

export { getDestinationDomain };
