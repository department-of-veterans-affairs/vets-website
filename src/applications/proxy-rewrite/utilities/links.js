export const updateLinkDomain = href => {
  let newHref = href;

  const domainsNeedingUpdate = [
    'http://localhost:3001',
    'http://localhost:3002',
    'https://staging.va.gov',
    'https://www.staging.va.gov',
    'https://va.gov',
  ];

  const prod = 'https://www.va.gov';

  if (href.charAt(0) === '/') {
    return `${prod}${href}`;
  }

  domainsNeedingUpdate.forEach(domain => {
    if (href.includes(domain)) {
      newHref = href.replace(domain, prod);
    }
  });

  return newHref;
};
