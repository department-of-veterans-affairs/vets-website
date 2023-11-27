function getDestinationDomain(href) {
  if (href.includes('va.gov')) {
    return 'VA.gov';
  }
  if (href.includes('mhvnp')) {
    return 'NationalPortal';
  }
  return 'Unknown';
}

export { getDestinationDomain };
