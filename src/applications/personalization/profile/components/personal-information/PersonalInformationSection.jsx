import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInfoTable from '../ProfileInfoTable';

const notSetText = 'This information is not available right now.';

const renderGender = gender => {
  let content = notSetText;
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return content;
};

const renderDOB = dob => (dob ? moment(dob).format('LL') : notSetText);

const PersonalInformationSection = ({ gender, dob }) => (
  <div className="vads-u-margin-bottom--6">
    <div className="vads-u-margin-bottom--3">
      <AdditionalInfo triggerText="Why do we ask for this?">
        <p className="vads-u-margin-y--1">
          Some of the information in this section tells us how you want to be
          addressed as a person. For example, our staff will know your pronouns
          and the name you’d like us to use when you call or come in to VA.
        </p>
        <p className="vads-u-margin-y--1">
          If you get health care through VA, information in this section helps
          your care team better assess your health needs and risks. For example,
          gender identity and sexual orientation are some of the factors that
          can affect a person’s health, well-being, and quality of life. We call
          these factors “social determinants of health.”
        </p>
        <p className="vads-u-margin-y--1">
          We also collect this information to better understand our Veteran
          community. This helps us make sure that we’re serving the needs of all
          Veterans.
        </p>
      </AdditionalInfo>
    </div>
    <div className="vads-u-margin-bottom--3">
      <AdditionalInfo triggerText="How do I update my name, date of birth, or sex assigned at birth?">
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3">
          If you’re enrolled in the VA health care program
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA medical center to update your personal
          information.
        </p>
        <a href="/find-locations/?facilityType=health">
          Find your nearest VA medical center{' '}
        </a>
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3 vads-u-margin-bottom--1">
          If you receive VA benefits, but aren’t enrolled in VA health care
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA regional office to update your personal
          information
        </p>
        <a href="/find-locations/?facilityType=benefits">
          Find your nearest VA regional office
        </a>
      </AdditionalInfo>
    </div>
    <ProfileInfoTable
      data={[
        { title: 'Date of birth', value: renderDOB(dob) },
        {
          title: 'Preferred name',
          id: FIELD_IDS[FIELD_NAMES.PREFERRED_NAME],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.PREFERRED_NAME}
            />
          ),
        },
        {
          title: 'Pronouns',
          id: FIELD_IDS[FIELD_NAMES.PRONOUNS],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.PRONOUNS}
            />
          ),
        },
        { title: 'Sex assigned at birth', value: renderGender(gender) },
        {
          title: 'Gender identity',
          id: FIELD_IDS[FIELD_NAMES.GENDER_IDENTITY],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.GENDER_IDENTITY}
            />
          ),
        },
        {
          title: 'Sexual orientation',
          id: FIELD_IDS[FIELD_NAMES.SEXUAL_ORIENTATION],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.SEXUAL_ORIENTATION}
            />
          ),
        },
      ]}
      level={2}
    />
  </div>
);

PersonalInformationSection.propTypes = {
  gender: PropTypes.string.isRequired,
  dob: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  gender: state.vaProfile?.personalInformation?.gender,
  dob: state.vaProfile?.personalInformation?.birthDate,
});

export default connect(mapStateToProps)(PersonalInformationSection);
