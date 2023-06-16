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
  standardAddressSchema,
  blankSchema,
} from '../utilities/data/profile';

/**
 * Profile settings
 * @typedef ContactInfoSettings
 * @type {Object}
 * @property {import('../utilities/data/profile').ContactInfoContent} content
 * @property {String} contactPath=contact-information - Contact info path of
 *  formConfig page
 * @property {String} addressSchema=standardAddressSchema - Address schema
 *  object that includes military base checkbox
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
 * @property {String[]} contactInfoPageKey=confirmContactInfo - set page key
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
    'homePhone|mobilePhone', // homePhone OR mobilePhone required
    // 'homePhone', // homePhone is required
    // 'mobilePhone', // mobilePhone is required
  ],
  // Page key used within the chapter
  contactInfoPageKey = 'confirmContactInfo',

  // must use same keys as above
  included = ['mobilePhone', 'homePhone', 'mailingAddress', 'email'],

  // depends callback for contact info page
  depends = null,
  contactInfoUiSchema = {},
} = {}) => {
  const config = {};
  const wrapperProperties = {};
  const keys = { wrapper: wrapperKey };

  if (included.includes(addressKey)) {
    keys.address = addressKey;
    wrapperProperties[addressKey] =
      addressSchema ||
      standardAddressSchema(contactInfoRequiredKeys.includes(keys.address));
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
      phoneSchema ||
      standardPhoneSchema(
        contactInfoRequiredKeys.join().includes(keys.homePhone),
      );
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
      standardPhoneSchema(
        contactInfoRequiredKeys.join().includes(keys.mobilePhone),
      );
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
        }),
      CustomPageReview: props =>
        ContactInfoReview({
          ...props,
          content,
          keys,
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
    },
    // edit pages; only accessible via ContactInfo component links
    ...config,
  };
};

export default profileContactInfo;
