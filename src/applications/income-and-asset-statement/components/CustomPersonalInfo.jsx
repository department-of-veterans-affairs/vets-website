import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { connect, useSelector } from 'react-redux';
import {
  PersonalInformation,
  PersonalInformationHeader,
  PersonalInformationCardHeader,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';
import { selectProfile } from '~/platform/user/selectors';

import formConfig from '../config/form';

const CustomPersonalInfo = props => {
  const { formData, setFormData } = props;

  const profile = useSelector(selectProfile);
  const { userFullName } = profile || {};

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
        ssnPath: 'veteranSsnLastFour',
        vaFileNumberPath: 'vaFileNumberLastFour',
      }}
      formOptions={formConfig.formOptions}
    >
      <PersonalInformationHeader>
        {/* Wrap h1 in a form so focus works - see
         https://github.com/department-of-veterans-affairs/vets-website/blob/9479f030cbff4d6cb28d8cdea022eeb306f03011/src/platform/forms-system/src/js/patterns/minimal-header/index.js#L69 */}
        <form>
          <h1 className="vads-u-margin-bottom--3 vads-u-font-size--h2">
            Confirm the personal information we have on file for you
          </h1>
        </form>
      </PersonalInformationHeader>
      <PersonalInformationCardHeader>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
          Personal information
        </h2>
      </PersonalInformationCardHeader>
    </PersonalInformation>
  );
};

CustomPersonalInfo.propTypes = {
  formData: PropTypes.shape({
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
