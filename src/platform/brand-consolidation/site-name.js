import isBrandConsolidationEnabled from './feature-flag';

const siteName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

export default siteName;
