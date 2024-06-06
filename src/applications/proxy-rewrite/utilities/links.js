export const updateLinkDomain = href => {
  const local1 = 'http://localhost:3001';
  const local2 = 'http://localhost:3002';
  const stagingWithoutWWW = 'https://staging.va.gov';
  const stagingWithWWW = 'https://www.staging.va.gov';
  const prodWithoutWWW = 'https://www.va.gov';
  const prodWithWWW = 'https://www.va.gov';

  if (href.startsWith(local1)) {
    return href.replace(local1, prodWithWWW);
  }

  if (href.startsWith(local2)) {
    return href.replace(local2, prodWithWWW);
  }

  if (href.startsWith(stagingWithoutWWW)) {
    return href.replace(stagingWithoutWWW, prodWithWWW);
  }

  if (href.startsWith(stagingWithWWW)) {
    return href.replace(stagingWithWWW, prodWithWWW);
  }

  if (href.startsWith(prodWithoutWWW)) {
    return href.replace(prodWithoutWWW, prodWithWWW);
  }

  if (href.charAt(0) === '/') {
    return `${prodWithWWW}${href}`;
  }

  return href;
};
