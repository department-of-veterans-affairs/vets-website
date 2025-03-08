import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { format, parseISO } from 'date-fns';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { InfoSection } from '../../../../../shared/components/InfoSection';
// import { genderLabels } from 'platform/static-data/labels';
import { normalizeFullName } from '../../../../../utils/helpers/general';
import { APP_URLS } from '../../../../../utils/constants';
import { isOnReviewPage } from '../../../TaskOrange/utils/reviewPage';

export const VeteranInformationBase = ({
  veteranFullName,
  veteranDateOfBirth,
  location,
}) => {
  const isReviewPage = isOnReviewPage(location?.pathname);
  const title = isReviewPage ? null : 'Applicant information';
  const formattedDob =
    veteranDateOfBirth && format(parseISO(veteranDateOfBirth), 'MMMM dd, yyyy');
  return (
    <InfoSection title={title} titleLevel={3}>
      <InfoSection.InfoBlock
        label="First name"
        value={veteranFullName?.first}
      />
      <InfoSection.InfoBlock
        label="Middle name"
        value={veteranFullName?.middle}
      />
      <InfoSection.InfoBlock label="Last name" value={veteranFullName?.last} />
      <InfoSection.InfoBlock label="Suffix" value={veteranFullName?.suffix} />
      <InfoSection.InfoBlock label="Date of birth" value={formattedDob} />
    </InfoSection>
  );
};

VeteranInformationBase.propTypes = {
  gender: PropTypes.string,
  location: PropTypes.object,
  veteranDateOfBirth: PropTypes.string,
  veteranFullName: PropTypes.object,
  veteranSocialSecurityNumber: PropTypes.string,
};

export const VeteranInformationInfoSection = withRouter(VeteranInformationBase);

export const VeteranProfileInformation = ({
  goBack,
  goForward,
  profile,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { userFullName, dob } = profile;

  // const { veteranSocialSecurityNumber } = veteran;

  const veteranName = normalizeFullName(userFullName, true);
  const veteranDOB = dob && format(parseISO(dob), 'MMMM dd, yyyy');
  const veteranDOBMobile = dob && format(parseISO(dob), 'MMM dd, yyyy');

  useEffect(() => {
    const progressBar = document.getElementById('nav-form-header');
    if (progressBar) {
      progressBar.setAttribute('total', '3');
    }
  }, []);

  return (
    <>
      <div className="vads-u-margin-top--2p5 vads-u-margin-bottom--2">
        <va-card class="task-gray-card">
          {/* <div className="vads-u-margin-y--3 vads-u-padding-left--2"> */}
          <dl>
            <div data-testid="ezr-veteran-fullname">
              <dt className="vads-u-visibility--screen-reader">Full name:</dt>
              <dd
                className="vads-u-font-weight--bold dd-privacy-mask"
                data-dd-action-name="Full name"
              >
                <h3 className="vads-u-margin-top--0">{veteranName}</h3>
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
          </dl>
        </va-card>
        <p className="vads-u-margin-y--4">
          <strong>Note:</strong> To protect your personal information, we don’t
          allow online changes to your name, Social Security number, date of
          birth, or gender. If you need to change this information, call us at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
          <dfn>
            <abbr title="Eastern Time">ET</abbr>
          </dfn>
          . We’ll give you instructions for how to change your information. Or
          you can learn how to change your legal name on file with VA.{' '}
          <va-link
            external
            href={APP_URLS.facilities}
            text="Learn how to change your legal name (opens in new tab)"
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
