export default function redirectToClaimTypePage(savedData) {
  if (savedData.metadata.returnUrl === '/veteran-information') return savedData;

  return Object.assign({}, savedData, {
    metadata: { returnUrl: '/claim-type' },
  });
}
