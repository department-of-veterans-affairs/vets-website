import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import DemographicItem from '../components/DemographicItem';
import { seeStaffMessageUpdated } from '../actions';

const Demographics = props => {
  const {
    demographics,
    isLoading,
    isUpdatePageEnabled,
    isNextOfKinPageEnabled,
    router,
    updateSeeStaffMessage,
  } = props;
  const seeStaffMessage =
    'If you don’t live at a fixed address right now, we’ll help you find the best way to stay connected with us.';

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      if (isNextOfKinPageEnabled) {
        goToNextPage(router, URLS.NEXT_OF_KIN);
      } else if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isNextOfKinPageEnabled, isUpdatePageEnabled, router],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-demographic-information',
      });
      updateSeeStaffMessage(seeStaffMessage);
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router, updateSeeStaffMessage],
  );

  const demographicFields = [
    { title: 'Mailing address', key: 'mailingAddress' },
    { title: 'Home address', key: 'homeAddress' },
    { title: 'Home phone', key: 'homePhone' },
    { title: 'Mobile phone', key: 'mobilePhone' },
    { title: 'Work phone', key: 'workPhone' },
    { title: 'Email address', key: 'emailAddress' },
  ];
  if (isLoading) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else if (!demographics) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-demographics">
        <h1>Is this your current contact information?</h1>
        <p className="vads-u-font-family--serif">
          We can better follow up with you after your appointment when we have
          your current information.
        </p>
        <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
          <dl>
            {demographicFields.map(demographicField => (
              <React.Fragment key={demographicField.key}>
                <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                  {demographicField.title}
                </dt>
                <dd>
                  {demographicField.key in demographics &&
                  demographics[demographicField.key] ? (
                    <DemographicItem
                      demographic={demographics[demographicField.key]}
                    />
                  ) : (
                    'Not available'
                  )}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <button
          onClick={() => yesClick()}
          className={'usa-button-secondary'}
          data-testid="yes-button"
        >
          Yes
        </button>
        <button
          onClick={() => noClick()}
          className="usa-button-secondary vads-u-margin-top--2"
          data-testid="no-button"
        >
          No
        </button>
        <Footer />
        <BackToHome />
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateSeeStaffMessage: seeStaffMessage => {
      dispatch(seeStaffMessageUpdated(seeStaffMessage));
    },
  };
};

Demographics.propTypes = {
  demographics: PropTypes.object,
  isLoading: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  isNextOfKinPageEnabled: PropTypes.bool,
  router: PropTypes.object,
  updateSeeStaffMessage: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(Demographics);
