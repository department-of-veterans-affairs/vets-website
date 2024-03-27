export const updateLinkDomain = href => {
  const local1 = 'http://localhost:3001';
  const local2 = 'http://localhost:3002';
  const staging = 'https://staging.va.gov';
  const prod = 'https://va.gov';

  if (href.includes(local1)) {
    return href.replace(local1, prod);
  }

  if (href.includes(local2)) {
    return href.replace(local2, prod);
  }

  if (href.includes(staging)) {
    return href.replace(staging, prod);
  }

  if (href.charAt(0) === '/') {
    return `${prod}${href}`;
  }

  return href;
};
