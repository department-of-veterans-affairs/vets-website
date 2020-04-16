import addJumplinkListeners from './addJumpLinkListeners';
import addQaSectionListeners from './addQaSectionListeners';
import addTeaserListeners from './addTeaserListeners';

const coronavirusFaqUrl = '/coronavirus-veteran-frequently-asked-questions/';
const isCoronavirusFaq = document.location.pathname === coronavirusFaqUrl;

if (isCoronavirusFaq) {
  addJumplinkListeners();
  addQaSectionListeners();
}

addTeaserListeners();
