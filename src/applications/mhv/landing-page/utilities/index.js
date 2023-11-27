function getDestinationDomain(href) {
  const url = new URL(href, document.location.href);

  const { hostname } = url;

  if (hostname.includes('vagov')) {
    return 'va.gov';
  }
  if (hostname.includes('mhvnp')) {
    return 'mhvnp';
  }

  return hostname;
}

export { getDestinationDomain };
