import { transformDd214Entry } from './dd214';
import { transformDeathCertificateEntry } from './deathCertificate';

export { transformDd214Entry } from './dd214';
export { transformDeathCertificateEntry } from './deathCertificate';
export { sanitize, formatIsoDate, maskSsn, EMPTY_VALUE } from './helpers';

export const transformArtifactsToSections = artifacts => {
  const results = {};
  if (artifacts?.dd214?.length) {
    results.DD214 = artifacts.dd214.map(transformDd214Entry);
  }
  if (artifacts?.deathCertificates?.length) {
    results['Death certificate'] = artifacts.deathCertificates.map(
      transformDeathCertificateEntry,
    );
  }
  return results;
};

export default transformArtifactsToSections;
