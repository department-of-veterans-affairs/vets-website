import '../../platform/polyfills';
import LazyLoad from 'vanilla-lazyload/dist/lazyload';
import Raven from 'raven-js';

import createCommonStore from '../../platform/startup/store';
import startSitewideComponents from '../../platform/site-wide';
import './alerts-dismiss-view';
import './ics-generator';
import createFacilityPage from './facilities/createFacilityPage';

import widgetTypes from './widgetTypes';
import subscribeAdditionalInfoEvents from './subscribeAdditionalInfoEvents';
import createApplicationStatus from './createApplicationStatus';
import createCallToActionWidget from './createCallToActionWidget';
import createMyVALoginWidget from './createMyVALoginWidget';
import createDisabilityFormWizard from '../disability-benefits/wizard/createWizard';
import createEducationApplicationStatus from '../edu-benefits/components/createEducationApplicationStatus';
import createOptOutApplicationStatus from '../edu-benefits/components/createOptOutApplicationStatus';

// No-react styles.
import './sass/static-pages.scss';

// Social share links behavior
import './social-share-links';

// Health care facility widgets
import createFacilityListWidget from './facilities/facilityList';
import createBasicFacilityListWidget from './facilities/basicFacilityList';
import facilityReducer from './facilities/reducers';

// Set further errors to have the appropriate source tag
Raven.setTagsContext({
  source: 'static-pages',
});

const store = createCommonStore(facilityReducer);
Raven.context(
  {
    tags: { source: 'site-wide' },
  },
  () => {
    startSitewideComponents(store);
  },
);

subscribeAdditionalInfoEvents();

createApplicationStatus(store, {
  formId: '21P-527EZ',
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyLink: '/pension/how-to-apply/',
  applyText: 'Apply for Veterans Pension Benefits',
  widgetType: widgetTypes.PENSION_APP_STATUS,
});

createApplicationStatus(store, {
  formId: '1010ez',
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyLink: '/health-care/how-to-apply/',
  applyText: 'Apply for Health Care Benefits',
  widgetType: widgetTypes.HEALTH_CARE_APP_STATUS,
});

createCallToActionWidget(store, widgetTypes.CTA);

createEducationApplicationStatus(store, widgetTypes.EDUCATION_APP_STATUS);

createOptOutApplicationStatus(store, widgetTypes.OPT_OUT_APP_STATUS);

createApplicationStatus(store, {
  formId: '21P-530',
  applyHeading: 'How do I apply?',
  additionalText: 'You can apply online right now.',
  applyText: 'Apply for Burial Benefits',
  widgetType: widgetTypes.BURIALS_APP_STATUS,
});

createDisabilityFormWizard(store, widgetTypes.DISABILITY_APP_STATUS);

createFacilityListWidget();
createFacilityPage(store);
createBasicFacilityListWidget();

// homepage widgets
if (location.pathname === '/') {
  createMyVALoginWidget(store);
}

/* eslint-disable no-unused-vars,camelcase */
const lazyLoad = new LazyLoad({
  elements_selector: '.lazy',
});
/* eslint-enable */
