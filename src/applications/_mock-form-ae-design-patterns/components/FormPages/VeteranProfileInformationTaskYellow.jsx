import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { format, parseISO } from 'date-fns';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { genderLabels } from 'platform/static-data/labels';
import { maskSSN, normalizeFullName } from '../../utils/helpers/general';
import { APP_URLS } from '../../utils/constants';

const VeteranProfileInformation = ({
  goBack,
  goForward,
  profile,
  veteran,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { userFullName, dob, gender } = profile;
  const { veteranSocialSecurityNumber } = veteran;

  const veteranName = normalizeFullName(userFullName, true);
  const veteranSSN = maskSSN(veteranSocialSecurityNumber);
  const veteranDOB = dob && format(parseISO(dob), 'MMMM dd, yyyy');
  const veteranDOBMobile = dob && format(parseISO(dob), 'MMM dd, yyyy');
  const veteranGender = gender && genderLabels[gender];

  return (
    <>
      <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
        <p>Confirm your information before you continue.</p>

        <va-card background>
          <div className="vads-u-padding-left--1 vads-u-padding-y--1">
            <dl className="vads-u-padding-y--0 vads-u-margin-y--0">
              <div
                data-testid="ezr-veteran-fullname"
                className="vads-u-margin-bottom--2"
              >
                <dt className="vads-u-visibility--screen-reader">Full name:</dt>
                <dd
                  className="vads-u-font-weight--bold dd-privacy-mask vads-u-font-family--serif"
                  data-dd-action-name="Full name"
                >
                  {veteranName}
                </dd>
              </div>
              <div
                data-testid="ezr-veteran-ssn"
                className="vads-u-margin-bottom--2"
              >
                <dt className="vads-u-display--inline-block vads-u-font-weight--bold vads-u-margin-right--0p5">
                  Social Security:
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-mask vads-u-font-family--sans"
                  data-dd-action-name="Social Security:"
                >
                  {veteranSSN}
                </dd>
              </div>
              {veteranDOB ? (
                <div data-testid="ezr-veteran-dob">
                  <dt className="vads-u-display--inline-block vads-u-margin-right--0p5 vads-u-font-weight--bold">
                    Date of birth:
                  </dt>
                  <dd
                    className="dd-privacy-mask medium-screen:vads-u-display--inline-block vads-u-display--none"
                    data-dd-action-name="Date of birth"
                  >
                    {veteranDOB}
                  </dd>
                  <dd
                    className="dd-privacy-mask vads-u-display--inline-block medium-screen:vads-u-display--none"
                    data-dd-action-name="Date of birth"
                  >
                    {veteranDOBMobile}
                  </dd>
                </div>
              ) : null}
              {veteranGender ? (
                <div data-testid="ezr-veteran-gender">
                  <dt className="vads-u-display--inline-block vads-u-margin-right--0p5 vads-u-font-weight--bold vads-u-margin-top--2">
                    Gender:
                  </dt>
                  <dd
                    className="vads-u-display--inline-block dd-privacy-mask"
                    data-dd-action-name="Gender"
                  >
                    {veteranGender}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </va-card>

        <p>
          Note: To protect your personal information, we don’t allow online
          changes to your name, date of birth, or Social Security number. If you
          need to change this information for your health benefits, call your VA
          health facility.{' '}
          <va-link
            href={APP_URLS.facilities}
            text="Find your VA health facility"
          />
        </p>
      </div>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

VeteranProfileInformation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  profile: PropTypes.object,
  veteran: PropTypes.object,
};

const mapStateToProps = state => ({
  profile: state.user.profile,
  veteran: state.form.data,
});

export default connect(mapStateToProps)(VeteranProfileInformation);
