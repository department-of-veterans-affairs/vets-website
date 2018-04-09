export function envIsProd() {
  return document.location.hostname === 'www.vets.gov';
}

export default function ensureEnvIsNotProd() {
  if (envIsProd()) document.location.replace('/');
}
