const { freeze } = Object;

export const TITLE = 'Order medical supplies';
export const INTRO_TITLE = 'Medical supplies';
export const INTRO_SUBTITLE =
  'Use this form to order hearing aid batteries and accessories and CPAP supplies';

export const DLC_EMAIL = 'dalc.css@va.gov';
export const DLC_TELEPHONE = '8776778710';

export const HEALTH_FACILITIES_URL = '/find-locations/?facilityType=health';

export const MDOT_ERROR_CODES = freeze({
  DECEASED: 'MDOT_deceased',
  INVALID: 'MDOT_invalid',
  SUPPLIES_NOT_FOUND: 'MDOT_supplies_not_found',
});

export const PRODUCT_GROUPS = freeze({
  ACCESSORIES: 'accessories',
  BATTERIES: 'batteries',
  APNEA: 'apnea',
});

export const PAGE_PATH = freeze({
  CONTACT_INFORMATION: '/contact-information',
  REVIEW_AND_SUBMIT: '/review-and-submit',
});
