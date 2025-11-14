import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { genderLabels } from 'platform/static-data/labels';
import { maskSSN, normalizeFullName } from '../../utils/helpers/general';
import { APP_URLS } from '../../utils/appUrls';
import { CONTACTS } from '../../utils/imports';

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
  const veteranDOB = dob && moment(dob).format('MM/DD/YYYY');
  const veteranGender = gender && genderLabels[gender];

  return (
    <>
      <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
        <p>This is the personal information we have on file for you.</p>

        <div className="va-address-block vads-u-margin-y--3">
          <dl>
            <div data-testid="ezr-veteran-fullname">
              <dt className="vads-u-visibility--screen-reader">Full name:</dt>
              <dd
                className="vads-u-font-weight--bold dd-privacy-mask"
                data-dd-action-name="Full name"
              >
                {veteranName}
              </dd>
            </div>
            <div data-testid="ezr-veteran-ssn">
              <dt className="vads-u-display--inline-block vads-u-margin-right--0p5">
                Social Security number:
              </dt>
              <dd
                className="vads-u-display--inline-block dd-privacy-mask"
                data-dd-action-name="Social Security number"
              >
                {veteranSSN}
              </dd>
            </div>
            {veteranDOB ? (
              <div data-testid="ezr-veteran-dob">
                <dt className="vads-u-display--inline-block vads-u-margin-right--0p5">
                  Date of birth:
                </dt>
                <dd
                  className="vads-u-display--inline-block dd-privacy-mask"
                  data-dd-action-name="Date of birth"
                >
                  {veteranDOB}
                </dd>
              </div>
            ) : null}
            {veteranGender ? (
              <div data-testid="ezr-veteran-gender">
                <dt className="vads-u-display--inline-block vads-u-margin-right--0p5">
                  Sex:
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
        <p>
          <strong>Note:</strong> If you need to update your personal
          information, call our VA benefits hotline at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact={CONTACTS[711]} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          .
        </p>
        <p>
          You can also call your VA health facility to get help changing your
          name on file with VA. Ask for the eligibility department.{' '}
          <va-link
            href={APP_URLS.facilities}
            text="Find your nearest VA health facility"
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
