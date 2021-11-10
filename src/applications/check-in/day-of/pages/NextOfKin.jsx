import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';
import { goToNextPage, URLS } from '../utils/navigation';
import BackButton from '../components/BackButton';
import BackToHome from '../components/BackToHome';
import { focusElement } from 'platform/utilities/ui';
import Footer from '../components/Footer';
import DemographicItem from '../components/DemographicItem';
import { seeStaffMessageUpdated } from '../actions';

const NextOfKin = props => {
  const {
    nextOfKin,
    isLoading,
    isDemographicsPageEnabled,
    isUpdatePageEnabled,
    router,
    updateSeeStaffMessage,
  } = props;

  const seeStaffMessage =
    'Our staff can help you update your next of kin information.';

  useEffect(() => {
    focusElement('h1');
  }, []);

  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-next-of-kin-information',
      });
      if (isUpdatePageEnabled) {
        goToNextPage(router, URLS.UPDATE_INSURANCE);
      } else {
        goToNextPage(router, URLS.DETAILS);
      }
    },
    [isUpdatePageEnabled, router],
  );

  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-next-of-kin-information',
      });
      updateSeeStaffMessage(seeStaffMessage);
      goToNextPage(router, URLS.SEE_STAFF);
    },
    [router, updateSeeStaffMessage],
  );

  const nextOfKinFields = [
    { title: 'Name', key: 'name' },
    { title: 'Relationship', key: 'relationship' },
    { title: 'Address', key: 'address' },
    { title: 'Phone', key: 'phone' },
    { title: 'Work phone', key: 'workPhone' },
  ];
  if (isLoading) {
    return <LoadingIndicator message={'Loading your appointments for today'} />;
  } else if (!nextOfKin) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 check-in-next-of-kin">
        {(isUpdatePageEnabled || isDemographicsPageEnabled) && (
          <BackButton router={router} />
        )}
        <h1>Is this your current next of kin information?</h1>
        <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
          <dl>
            {nextOfKinFields.map(nextOfKinField => (
              <React.Fragment key={nextOfKinField.key}>
                <dt className="vads-u-font-size--h3 vads-u-font-family--serif">
                  {nextOfKinField.title}
                </dt>
                <dd>
                  {nextOfKinField.key in nextOfKin &&
                  nextOfKin[nextOfKinField.key] ? (
                    <DemographicItem
                      demographic={nextOfKin[nextOfKinField.key]}
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

NextOfKin.propTypes = {
  nextOfKin: PropTypes.object,
  isLoading: PropTypes.bool,
  isDemographicsPageEnabled: PropTypes.bool,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
  updateSeeStaffMessage: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(NextOfKin);
