import {
  EditAddress,
  EditEmail,
  EditHomePhone,
  EditMobilePhone,
} from '../components/EditContactInfo';
import ContactInfo from '../components/ContactInfo';
import ContactInfoReview from '../components/ContactInfoReview';

import {
  getContent,
  CONTACT_INFO_PATH,
  standardPhoneSchema,
  standardEmailSchema,
  profileAddressSchema,
  blankSchema,
  clearReturnState,
} from '../utilities/data/profile';

/**
 * Profile settings
 * @typedef ContactInfoSettings
 * @type {Object}
 * @property {import('../utilities/data/profile').ContactInfoContent} content
 * @property {String} contactPath=contact-information - Contact info path of
 *  formConfig page
 * @property {String} addressSchema=profileAddressSchema - Profile
 *  address schema object
 * @property {Object} emailSchema=standardEmailSchema - Email schema object for
 *  email string
 * @property {Object} phoneSchema=standardPhoneSchema - Phone schema object with
 *  country code, area code, phone number & extension values
 * @property {String} wrapperKey=veteran - wrapper key value set in
 *  ContactInfoKeys
 * @property {String} addressKey=mailingAddress - address key value set in
 *  ContactInfoKeys
 * @property {String} homePhoneKey=homePhone - home phone key value set in
 *  ContactInfoKeys
 * @property {String} mobilePhoneKey=mobilePhone - mobile phone key value set in
 *  ContactInfoKeys
 * @property {String} emailKey=email - email key value set in ContactInfoKeys
 * @property {String[]} contactInfoRequiredKeys - array of key values in
 *  ContactInfoKeys that are to be required before proceeding
 * @property {String} contactInfoPageKey=confirmContactInfo - set page key
 *  within the form config chapter
 * @property {String[]} included=['mobilePhone', 'homePhone', 'mailingAddress',
 *  'email'] - array of ContactInfoKeys to show on the contact info page
 * @property {Function} depends=null - depends callback function; return true to
 *  make the main confirmation page visible
 * @property {Object} contactInfoUiSchema={} - custom uiSchema for the contact
 *  info page
 */
/**
 * Add contact information page with 3-4 edit pages to config/form - spread the
 * returned object into the app config/form
 * @param {ContactInfoSettings} - Contact info settings
 * @returns {Object} - form config pages for a chapter
 */
const profileContactInfo = ({
  content = getContent('application'),

  contactPath = CONTACT_INFO_PATH,
  addressSchema,
  emailSchema,
  phoneSchema,

  // keys to use in form data
  wrapperKey = 'veteran',
  addressKey = 'mailingAddress',
  homePhoneKey = 'homePhone',
  mobilePhoneKey = 'mobilePhone',
  emailKey = 'email',

  // setting these keys enables validation; must use the same keys as above
  contactInfoRequiredKeys = [
    'mailingAddress',
    'email',
    'homePhone',
    'mobilePhone',
  ],
  // Page key used within the formConfig chapter
  contactInfoPageKey = 'confirmContactInfo',

  // Must use same keys as above
  included = ['mobilePhone', 'homePhone', 'mailingAddress', 'email'],

  // depends callback for contact info page
  depends = null,
  contactInfoUiSchema = {},
} = {}) => {
  const config = {};
  const wrapperProperties = {};
  const keys = { wrapper: wrapperKey };
  const requiredList = contactInfoRequiredKeys;

  if (included.includes(addressKey)) {
    keys.address = addressKey;
    wrapperProperties[addressKey] = addressSchema || profileAddressSchema;
    config[`${contactInfoPageKey}EditMailingAddress`] = {
      title: content.editMailingAddress,
      path: `edit-${contactPath}-mailing-address`,
      CustomPage: props => EditAddress({ ...props, content, contactPath }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
    };
  }

  if (included.includes(homePhoneKey)) {
    keys.homePhone = homePhoneKey;
    wrapperProperties[homePhoneKey] =
      phoneSchema || standardPhoneSchema(requiredList.includes(keys.homePhone));
    config[`${contactInfoPageKey}EditHomePhone`] = {
      title: content.editHomePhone,
      path: `edit-${contactPath}-home-phone`,
      CustomPage: props => EditHomePhone({ ...props, content, contactPath }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
    };
  }
  if (included.includes(mobilePhoneKey)) {
    keys.mobilePhone = mobilePhoneKey;
    wrapperProperties[mobilePhoneKey] =
      phoneSchema ||
      standardPhoneSchema(requiredList.includes(keys.mobilePhone));
    config[`${contactInfoPageKey}EditMobilePhone`] = {
      title: content.editMobilePhone,
      path: `edit-${contactPath}-mobile-phone`,
      CustomPage: props => EditMobilePhone({ ...props, content, contactPath }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
    };
  }
  if (included.includes(emailKey)) {
    keys.email = emailKey;
    wrapperProperties[emailKey] = emailSchema || standardEmailSchema;
    config[`${contactInfoPageKey}EditEmailAddress`] = {
      title: content.editEmail,
      path: `edit-${contactPath}-email-address`,
      CustomPage: props => EditEmail({ ...props, content, contactPath }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
    };
  }

  return {
    [contactInfoPageKey]: {
      title: content.title,
      path: contactPath,
      CustomPage: props =>
        ContactInfo({
          ...props,
          content,
          contactPath,
          keys,
          requiredKeys: contactInfoRequiredKeys,
          contactInfoPageKey,
        }),
      CustomPageReview: props =>
        ContactInfoReview({
          ...props,
          content,
          keys,
          contactInfoPageKey,
        }),
      uiSchema: contactInfoUiSchema,
      schema: {
        type: 'object',
        properties: {
          // we're keeping this schema structure where 'veteran' contains all
          // the contact info
          [keys.wrapper]: {
            type: 'object',
            required: contactInfoRequiredKeys,
            properties: wrapperProperties,
          },
        },
      },
      depends,
      onFormExit: formData => {
        clearReturnState();
        return formData;
      },
    },
    // edit pages; only accessible via ContactInfo component links
    ...config,
  };
};

// review error settings
/**
 * Profile settings
 * @typedef profileReviewErrorOverrideSettings
 * @type {Object}
 * @property {String} contactInfoChapterKey=infoPages - chapter in config/form
 *  containing the contact info pages
 * @property {String} contactInfoPageKey=confirmContactInfo - set page key
 *  within the form config chapter
 * @property {String} wrapperKey=veteran - wrapper key value set in
 *  ContactInfoKeys
 */
export const profileReviewErrorOverride = ({
  contactInfoChapterKey = 'infoPages',
  contactInfoPageKey = 'confirmContactInfo',
  wrapperKey = 'veteran',
} = {}) => err => {
  if (typeof err === 'string' && err.startsWith(wrapperKey)) {
    return {
      chapterKey: contactInfoChapterKey,
      pageKey: contactInfoPageKey,
    };
  }
  return null;
};

export default profileContactInfo;
