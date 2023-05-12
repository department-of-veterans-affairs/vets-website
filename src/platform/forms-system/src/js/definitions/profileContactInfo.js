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
 * @property {String} [contactPath=contact-information] - Contact info path of
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
 * @property {String[]} contactInfoRequiredKeys=['mailingAddress', 'email',
 *  'homePhone|mobilePhone'] - makes the fields required & enables validation
 * @property {String[]} included=['mobilePhone', 'homePhone', 'mailingAddress',
 *  'email'] - array of ContactInfoKeys to show on the contact info page
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

  // must use same keys as above
  included = ['mobilePhone', 'homePhone', 'mailingAddress', 'email'],
} = {}) => {
  const config = {};
  const wrapperProperties = {};
  const keys = { wrapper: wrapperKey };

  if (included.includes(addressKey)) {
    keys.address = addressKey;
    wrapperProperties[addressKey] =
      addressSchema ||
      standardAddressSchema(contactInfoRequiredKeys.includes(keys.address));
    config.editMailingAddress = {
      title: content.editMailingAddress,
      path: 'edit-mailing-address',
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
    config.editHomePhone = {
      title: content.editHomePhone,
      path: 'edit-home-phone',
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
    config.editMobilePhone = {
      title: content.editMobilePhone,
      path: 'edit-mobile-phone',
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
    config.editEmailAddress = {
      title: content.editEmail,
      path: 'edit-email-address',
      CustomPage: props => EditEmail({ ...props, content, contactPath }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
    };
  }

  return {
    confirmContactInformation: {
      title: content.title,
      path: contactPath,
      CustomPage: props =>
        ContactInfo({
          ...props,
          content,
          keys,
          requiredKeys: contactInfoRequiredKeys,
        }),
      CustomPageReview: props =>
        ContactInfoReview({
          ...props,
          content,
          keys,
          contactPath,
          requiredKeys: contactInfoRequiredKeys,
        }),
      uiSchema: {},
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
    },
    // edit pages; only accessible via ContactInfo component links
    ...config,
  };
};

export default profileContactInfo;
