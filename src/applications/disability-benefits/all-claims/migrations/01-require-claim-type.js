export default function redirectToClaimTypePage(savedData) {
  if (savedData.metadata.returnUrl === '/veteran-information') return savedData;

  return { ...savedData, metadata: { returnUrl: '/claim-type' } };
}
