function getDestinationDomain(href) {
  if (href.includes('VAgov')) {
    return 'VAgov';
  }
  if (href.includes('NationalPortal')) {
    return 'NationalPortal';
  }
  return 'Unknown';
}

export { getDestinationDomain };
