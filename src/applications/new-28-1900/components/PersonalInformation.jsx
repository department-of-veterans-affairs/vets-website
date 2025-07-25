import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { selectProfile } from '~/platform/user/selectors';

const PersonalInformation = ({ formData }) => {

  const { dob, userFullName = {} } = useSelector(selectProfile);
  const { first, middle, last, suffix } = userFullName;
  const dobFriendly = dob ? format(parseISO(dob), 'MMMM dd, yyyy') : null;

  return (
    <>
      <h3>
        Confirm the contact information we have on file for you
      </h3>
      <va-card>
        <div className="vads-u-padding-left--1 vads-u-padding-y--1">
          <h4 className="vads-u-font-size--h3 vads-u-margin-bottom--2 vads-u-margin-top--0">
            Personal information
          </h4>
          <dl className="vads-u-padding-y--0 vads-u-margin-y--0">
            <div className="vads-u-margin-bottom--2">
              <dt className="vads-u-visibility--screen-reader">
                Full name:
              </dt>
              <dd
                className="dd-privacy-hidden vads-u-font-family--serif"
                data-dd-action-name="Full name"
              >
                <strong>
                  Name:
                </strong>
                {` ${first || ''} ${middle || ''} ${last || ''}`} {suffix ? `, ${suffix}` : null}
              </dd>
            </div>
            <div>
              <dt className="vads-u-display--inline-block vads-u-margin-right--0p5 vads-u-font-weight--bold">
                Date of birth:
              </dt>
              <dd
                className="dd-privacy-mask medium-screen:vads-u-display--inline-block vads-u-display--none"
                data-dd-action-name="Date of birth"
              >
                { dobFriendly ? (
                  <span
                    className="dob dd-privacy-mask"
                    data-dd-action-name="Claimant's date of birth"
                  >
                    {dobFriendly}
                  </span>
                ) : null}
              </dd>
            </div>
          </dl>
        </div>
      </va-card>
      <p className="vads-u-margin-top--2">
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your name, date of birth, or Social Security
        number. If you need to change this information, call us at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ). We’re here Monday through Friday, between 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>
      <p className="vads-u-margin-bottom--4">
        <va-link
          external
          href="/resources/how-to-change-your-legal-name-on-file-with-va/"
          text="Find more detailed instructions for how to change your legal name on file"
        />
      </p>
    </>
  );
};

PersonalInformation.propTypes = {
  formData: PropTypes.shape({
    veteran: PropTypes.shape({
      ssnLastFour: PropTypes.string,
      vaFileLastFour: PropTypes.string,
    }),
  }),
};

export default PersonalInformation;
