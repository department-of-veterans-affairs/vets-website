import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { selectProfile } from 'platform/user/selectors';
import { scrollToTop } from 'platform/utilities/scroll';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';

import { maskID } from '../../shared/utils';
import { DEPENDENT_CHOICES } from '../constants';

/**
 * COnfirmation page component
 * @typedef {object} ConfirmationPageProps
 * @property {object} route - route object
 * @property {object} route.formConfig - main form config
 *
 * @param {ConfirmationPageProps} props - Confirmation page props
 * @returns {React.Component} - Confirmation page
 */
export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const {
    veteranInformation,
    email,
    phone,
    address = {},
    internationalPhone,
    dependents,
    hasDependentsStatusChanged,
  } = form.data || {};
  const { ssnLastFour } = veteranInformation || {};
  const { dob, userFullName = {} } = useSelector(selectProfile);
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || Date.now();
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  const dobDate = dob ? formatDateParsedZoneLong(dob) : null;
  const phoneSource = form.data?.['view:phoneSource'] || 'Mobile';

  useEffect(() => {
    scrollToTop();
  }, []);

  const alertContent = (
    <>
      <p>Your submission is in progress.</p>
      <p>
        It can take up to 10 days for us to receive your form.
        {confirmationNumber &&
          ` Your confirmation number is ${confirmationNumber}.`}
      </p>
    </>
  );

  const step1Content = (
    <p>
      This can take up to 10 days. When we receive your form, we’ll update the
      status on My VA.
    </p>
  );

  const showItem = (label, value) =>
    value ? (
      <li>
        <div className="vads-u-color--gray">{label}</div>
        <div className="dd-privacy-mask" dd-action-name={label}>
          {value}
        </div>
      </li>
    ) : null;

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
    >
      <ConfirmationView.SubmissionAlert content={alertContent} />
      {submission.response?.pdfUrl && <ConfirmationView.SavePdfDownload />}

      {/* <ConfirmationView.ChapterSectionCollection /> */}
      <va-accordion bordered open-single>
        <va-accordion-item
          header="Information you submitted on this form"
          bordered
        >
          <div>
            <h3 className="vads-u-margin-top--0">Your personal information</h3>
            <ul className="vads-u-padding--0 remove-bullets">
              {showItem('First name', userFullName.first)}
              {showItem('Middle name', userFullName.middle)}
              {showItem('Last name', userFullName.last)}
              {showItem('Social Security number', maskID(ssnLastFour))}
              {showItem('Date of birth', dobDate)}
            </ul>
            <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
            <h3 className="vads-u-margin-top--0">
              Veteran’s contact information
            </h3>
            <ul className="vads-u-padding--0 remove-bullets">
              {showItem('Country', address.country)}
              {showItem('Street address', address.street)}
              {showItem('Street address line 2', address.street2)}
              {showItem('City', address.city)}
              {showItem('State', address.state)}
              {showItem('Postal code', address.postalCode)}
              {showItem('Email address', email)}
              {showItem(
                `${phoneSource} phone number`,
                <va-telephone contact={phone} not-clickable="true" />,
              )}
              {showItem('International number', internationalPhone)}
            </ul>
            <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />

            <h3 className="vads-u-margin-top--0">
              Dependents on your VA benefits
            </h3>
            <ul className="vads-u-padding--0 remove-bullets">
              {dependents?.length > 0
                ? dependents.map((dep, index) => (
                    <li key={index}>
                      <h4
                        className="dd-privacy-mask"
                        dd-action-name="dependent name"
                      >
                        {dep.fullName}
                      </h4>
                      <ul className="vads-u-padding--0 remove-bullets">
                        {showItem('Social Security number', maskID(dep.ssn))}
                        {showItem('Date of birth', dep.dob)}
                        {showItem('Age', `${dep.age} years old`)}
                        {showItem('Relationship', dep.relationship)}
                      </ul>
                    </li>
                  ))
                : 'No dependents found.'}
            </ul>
            <ul className="vads-u-padding--0 remove-bullets">
              {showItem(
                'Has the status of your dependents changed?',
                DEPENDENT_CHOICES[hasDependentsStatusChanged],
              )}
            </ul>
          </div>
        </va-accordion-item>
      </va-accordion>

      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList item1Content={step1Content} />
      <ConfirmationView.HowToContact />
      <p>
        <strong>If you don’t hear back from us about your claim,</strong> don’t
        file another claim. Contact us online or call us instead.
      </p>

      <ConfirmationView.GoBackLink text="Go back to VA.gov" />

      <va-need-help class="vads-u-margin-y--6">
        <div slot="content">
          For help filling out this form, or if the form isn’t working right,
          please call VA Benefits and Services at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact="711" tty />
          ).
        </div>
      </va-need-help>
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
