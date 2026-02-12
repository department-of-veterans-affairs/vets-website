import React from 'react';
import PropTypes from 'prop-types';
import {
  getContent,
  CONTACT_INFO_PATH,
  standardPhoneSchema,
  standardEmailObjectSchema,
  profileAddressSchema,
  blankSchema,
  getReturnState,
  clearReturnState,
} from 'platform/forms-system/src/js/utilities/data/profile';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import {
  EditAddress,
  EditEmail,
  EditHomePhone,
  EditMobilePhone,
} from './EditContactInfo';
import ContactInfo from './ContactInfo';
import ContactInfoReview from './ContactInfoReview';

/**
 * Add this page with 3-4 edit pages to config/form
 * Spread the returned object into the app config/form
 * @type {PrefillContactInfoPagesConfig}
 * @returns {Object} - form config pages for a chapter
 */
const profileContactInfoPages = ({
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
  disableMockContactInfo = true,
  contactSectionHeadingLevel = null,
  editContactInfoHeadingLevel = null,
  prefillPatternEnabled = true,
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
      path: `${contactPath}/edit-mailing-address`,
      CustomPage: props =>
        EditAddress({
          ...props,
          content,
          contactPath,
          editContactInfoHeadingLevel,
          prefillPatternEnabled,
          requiredKeys: contactInfoRequiredKeys,
          contactInfoPageKey,
          disableMockContactInfo,
          keys,
          formKey: addressKey,
        }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
      onNavBack: ({ goPath }) => goPath(contactPath),
    };
  }

  if (included.includes(homePhoneKey)) {
    keys.homePhone = homePhoneKey;
    wrapperProperties[homePhoneKey] =
      phoneSchema || standardPhoneSchema(requiredList.includes(keys.homePhone));
    config[`${contactInfoPageKey}EditHomePhone`] = {
      title: content.editHomePhone,
      path: `${contactPath}/edit-home-phone`,
      CustomPage: props =>
        EditHomePhone({
          ...props,
          content,
          contactPath,
          editContactInfoHeadingLevel,
          requiredKeys: contactInfoRequiredKeys,
          contactInfoPageKey,
          disableMockContactInfo,
          keys,
        }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
      onNavBack: ({ goPath }) => goPath(contactPath),
    };
  }

  if (included.includes(mobilePhoneKey)) {
    keys.mobilePhone = mobilePhoneKey;
    wrapperProperties[mobilePhoneKey] =
      phoneSchema ||
      standardPhoneSchema(requiredList.includes(keys.mobilePhone));
    config[`${contactInfoPageKey}EditMobilePhone`] = {
      title: content.editMobilePhone,
      path: `${contactPath}/edit-mobile-phone`,
      CustomPage: props =>
        EditMobilePhone({
          ...props,
          content,
          contactPath,
          editContactInfoHeadingLevel,
          requiredKeys: contactInfoRequiredKeys,
          contactInfoPageKey,
          disableMockContactInfo,
          keys,
        }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
      onNavBack: ({ goPath }) => goPath(contactPath),
    };
  }

  if (included.includes(emailKey)) {
    keys.email = emailKey;
    wrapperProperties[emailKey] = emailSchema || standardEmailObjectSchema;
    config[`${contactInfoPageKey}EditEmailAddress`] = {
      title: content.editEmail,
      path: `${contactPath}/edit-email-address`,
      CustomPage: props =>
        EditEmail({
          ...props,
          content,
          contactPath,
          editContactInfoHeadingLevel,
          requiredKeys: contactInfoRequiredKeys,
          contactInfoPageKey,
          disableMockContactInfo,
          keys,
        }),
      CustomPageReview: null, // not shown on review & submit
      depends: () => false, // accessed from contact info page
      uiSchema: {},
      schema: blankSchema,
      onNavBack: ({ goPath }) => goPath(contactPath),
    };
  }

  const CustomPage = props => (
    <ContactInfo
      {...props}
      content={content}
      contactPath={contactPath}
      keys={keys}
      requiredKeys={contactInfoRequiredKeys}
      contactInfoPageKey={contactInfoPageKey}
      disableMockContactInfo={disableMockContactInfo}
      contactSectionHeadingLevel={contactSectionHeadingLevel}
      editContactInfoHeadingLevel={editContactInfoHeadingLevel}
      prefillPatternEnabled={prefillPatternEnabled}
    />
  );

  CustomPage.propTypes = {
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
  };

  return {
    [contactInfoPageKey]: {
      title: content.title,
      path: contactPath,
      CustomPage,
      CustomPageReview: props => (
        <ContactInfoReview
          {...props}
          content={content}
          keys={keys}
          contactInfoPageKey={contactInfoPageKey}
        />
      ),
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
      // overide scroll & focus header
      scrollAndFocusTarget: () => {
        if (!getReturnState()) {
          scrollTo('topContentElement');
          focusElement('h3');
        }
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

export { profileContactInfoPages };
