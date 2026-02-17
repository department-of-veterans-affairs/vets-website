import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui/focus';
import { getSchedulingPreferencesOptionInCopy } from 'platform/user/profile/vap-svc/util/health-care-settings/schedulingPreferencesUtils';
import {
  AddressView,
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
  selectVAPContactInfoField,
} from 'platform/user/exportsFile';
import PhoneView from '@@vap-svc/components/PhoneField/PhoneView';
import { FIELD_OPTION_IDS } from '@@vap-svc/constants/schedulingPreferencesConstants';

const ContactMethodConfirm = ({
  pageData = {},
  email,
  mailingAddress,
  mobilePhone,
  homePhone,
  workPhone,
  handlers,
}) => {
  const data = pageData.data || {};
  const fieldName = FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD;
  useEffect(() => {
    focusElement('h1');
  }, []);

  useEffect(() => {
    // Check for existing data on the confirm step and push to profile edit if missing
    let existingData;
    switch (pageData.data[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]) {
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
        .TELEPHONE_MOBILE:
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
        .TEXT_MESSAGE:
        existingData = mobilePhone;
        break;
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
        .TELEPHONE_HOME:
        existingData = homePhone;
        break;
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]
        .TELEPHONE_WORK:
        existingData = workPhone;
        break;
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD].EMAIL:
        existingData = email;
        break;
      case FIELD_OPTION_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD].US_POST:
        existingData = mailingAddress;
        break;
      default:
        existingData = false;
    }
    if (!existingData) {
      // Save the contact method preference in the background as the user is redirected to edit the related contact info field
      handlers.updateContactInfo();
    }
  }, [
    pageData,
    mobilePhone,
    homePhone,
    workPhone,
    email,
    mailingAddress,
    handlers,
  ]);

  const cardContent = {
    title: '',
    description: '',
    body: '',
  };
  switch (data[fieldName]) {
    case 'option-6':
      // 'no preference',
      // This page isn't reachable for this option
      break;
    case 'option-5':
      // 'contact email',
      cardContent.title = 'Contact email';
      cardContent.description = FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.EMAIL];
      cardContent.body = email?.emailAddress;
      break;
    case 'option-38':
      // 'home phone',
      cardContent.title = 'Home phone number';
      cardContent.description =
        FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.HOME_PHONE];
      cardContent.body = <PhoneView data={homePhone} />;
      break;
    case 'option-1':
    case 'option-2':
      // 'mobile phone'
      cardContent.title = 'Mobile phone number';
      cardContent.description =
        FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.MOBILE_PHONE];
      cardContent.body = <PhoneView data={mobilePhone} />;
      break;
    case 'option-39':
      // 'work phone',
      cardContent.title = 'Work phone number';
      cardContent.description =
        FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.WORK_PHONE];
      cardContent.body = <PhoneView data={workPhone} />;
      break;
    case 'option-3':
      // 'secure message
      // This page isn't reachable for this option
      break;
    case 'option-4':
      // 'mailing address',
      cardContent.title = 'Mailing address';
      cardContent.description =
        FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.MAILING_ADDRESS];
      cardContent.customBody = <AddressView data={mailingAddress} />;
      break;
    default:
      return null;
  }

  return (
    <>
      <p>
        This is the{' '}
        {getSchedulingPreferencesOptionInCopy(fieldName, data[fieldName])} we
        have on file for you. If it’s correct, select{' '}
        <strong>Confirm information</strong>. If you need to update it here and
        in your profile, select <strong>Update information</strong>.
      </p>
      <va-card>
        <div>
          <h2 className="vads-u-font-size--h4 vads-u-margin-top--0">
            {cardContent.title}
          </h2>
          <p className="vads-u-color--gray">{cardContent.description}</p>
          {cardContent.customBody || (
            <p className="vads-u-margin-bottom--0">{cardContent.body}</p>
          )}
        </div>
      </va-card>
    </>
  );
};

const mapStateToProps = state => {
  return {
    email: selectVAPContactInfoField(state, 'email'),
    mailingAddress: selectVAPContactInfoField(state, 'mailingAddress'),
    mobilePhone: selectVAPContactInfoField(state, 'mobilePhone'),
    homePhone: selectVAPContactInfoField(state, 'homePhone'),
    workPhone: selectVAPContactInfoField(state, 'workPhone'),
  };
};

ContactMethodConfirm.propTypes = {
  handlers: PropTypes.object.isRequired,
  pageData: PropTypes.object.isRequired,
  email: PropTypes.object,
  error: PropTypes.bool,
  homePhone: PropTypes.object,
  mailingAddress: PropTypes.object,
  mobilePhone: PropTypes.object,
  workPhone: PropTypes.object,
};

export default connect(mapStateToProps)(ContactMethodConfirm);
