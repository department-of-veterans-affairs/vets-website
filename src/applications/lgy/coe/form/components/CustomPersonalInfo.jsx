import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  PersonalInformation,
  PersonalInformationCardHeader,
  PersonalInformationHeader,
  PersonalInformationNote,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';

const CustomPersonalInfo = props => {
  return (
    <PersonalInformation
      {...props}
      data={props.formData}
      config={{
        name: { show: true },
        ssn: { show: true, required: false },
        dateOfBirth: { show: true },
      }}
      dataAdapter={{
        ssnPath: 'veteranSsnLastFour',
      }}
      formOptions={props.formOptions}
    >
      <PersonalInformationHeader>
        <h3 className="vads-u-margin-bottom--3">
          Confirm the personal information we have on file for you
        </h3>
      </PersonalInformationHeader>
      <PersonalInformationCardHeader>
        <h4 className="vads-u-font-size--h3 vads-u-margin-top--1 vads-u-font-size--h3">
          Personal information
        </h4>
      </PersonalInformationCardHeader>
      <PersonalInformationNote>
        <p>
          <strong>Note:</strong> To protect your personal information, we don’t
          allow online changes to your name, date of birth, or Social Security
          number. If you need to change any of this information for your COE,
          you’ll need to update it before you continue filling out the form. You
          can call us at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
        <div className="vads-u-margin-top--6 vads-u-margin-bottom--4">
          <p>
            <va-link
              external
              href="/resources/how-to-change-your-legal-name-on-file-with-va/"
              text="Find more detailed instructions for how to change your legal name"
            />
          </p>
        </div>
      </PersonalInformationNote>
    </PersonalInformation>
  );
};

CustomPersonalInfo.propTypes = {
  formData: PropTypes.object,
  formOptions: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data,
  formOptions: state.form?.formConfig?.formOptions,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomPersonalInfo);
