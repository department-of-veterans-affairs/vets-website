import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { connect, useSelector } from 'react-redux';
import {
  PersonalInformation,
  PersonalInformationHeader,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import { selectProfile } from '~/platform/user/selectors';

const CustomPersonalInfo = props => {
  const { formData, setFormData } = props;

  const profile = useSelector(selectProfile);
  const { userFullName, email: profileEmail, phone: profilePhone } =
    profile || {};
  const { email, phone } = formData || {};

  // Initialize email and phone if needed
  useEffect(
    () => {
      const updatedFormData = { ...formData };
      let needsUpdate = false;

      if (!email && profileEmail) {
        updatedFormData.email = profileEmail;
        needsUpdate = true;
      }

      if (!phone && profilePhone) {
        updatedFormData.phone = profilePhone;
        needsUpdate = true;
      }

      if (needsUpdate) {
        setFormData(updatedFormData);
      }
    },
    [email, phone, profileEmail, profilePhone, formData, setFormData],
  );

  // Initialize veteranFullName if needed
  useEffect(
    () => {
      if (
        formData?.claimantType === 'VETERAN' &&
        userFullName &&
        JSON.stringify(formData?.veteranFullName) !==
          JSON.stringify(userFullName)
      ) {
        setFormData({
          ...formData,
          veteranFullName: userFullName,
        });
      }
    },
    [formData, setFormData, userFullName],
  );
  return (
    <PersonalInformation
      {...props}
      config={{
        name: { show: true, required: true },
        ssn: { show: true, required: true },
        vaFileNumber: { show: true, required: false },
        dateOfBirth: { show: false },
      }}
      dataAdapter={{
        ssnPath: 'veteranSocialSecurityNumber',
        vaFileNumberPath: 'vaFileNumber',
      }}
    >
      <PersonalInformationHeader>
        <h1 className="vads-u-margin-bottom--3 vads-u-font-size--h2">
          Confirm the personal information we have on file for you
        </h1>
      </PersonalInformationHeader>
    </PersonalInformation>
  );
};

CustomPersonalInfo.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    claimantType: PropTypes.string.isRequired,
    veteranFullName: PropTypes.object,
  }),
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomPersonalInfo);
