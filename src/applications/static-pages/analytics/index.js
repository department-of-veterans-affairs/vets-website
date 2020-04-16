import addJumplinkListeners from './addJumpLinkListeners';
import addQaSectionListeners from './addQaSectionListeners';
import addTeaserListeners from './addTeaserListeners';
import addHomepageBannerListeners from './addHomepageBannerListeners';

const homepageUrl = '/';
const coronavirusFaqUrl = '/coronavirus-veteran-frequently-asked-questions/';

const isCoronavirusFaq = document.location.pathname === coronavirusFaqUrl;
const isHomepage = document.location.pathname === homepageUrl;

if (isCoronavirusFaq) {
  addJumplinkListeners();
  addQaSectionListeners();
} else if (isHomepage) {
  addHomepageBannerListeners();
}

addTeaserListeners();
