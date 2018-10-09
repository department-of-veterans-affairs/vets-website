import isBrandConsolidationEnabled from './feature-flag';

const siteName = isBrandConsolidationEnabled() ? 'Vets.gov' : 'VA.gov';

export default siteName;
