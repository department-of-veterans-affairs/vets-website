import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';

import { getAppData } from '../selectors/selectors';
import HowToApplyPost911GiBillV1 from '../components/HowToApplyPost911GiBillV1';
import HowToApplyPost911GiBillV2 from '../components/HowToApplyPost911GiBillV2';
import IntroductionLoginV1 from '../components/IntroductionLoginV1';
import IntroductionLoginV2 from '../components/IntroductionLoginV2';
import LoadingIndicator from '../components/LoadingIndicator';
import IntroductionProcessListV2 from '../components/IntroductionProcessListV2';
import IntroductionProcessListV1 from '../components/IntroductionProcessListV1';

export const IntroductionPage = ({
  featureTogglesLoaded,
  route,
  showMebDgi40Features,
  showUnverifiedUserAlert,
}) => {
  return (
    <div className="schemaform-intro">
      {showMebDgi40Features ? (
        <>
          <h1 className="vads-u-margin-bottom--1p5">
            Apply for VA education benefits
          </h1>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
            Equal to VA Form 22-1990 (Application for VA Education Benefits)
          </h2>
        </>
      ) : (
        <>
          <FormTitle title="Apply for VA education benefits" />
          <p>
            Equal to VA Form 22-1990 (Application for VA Education Benefits)
          </p>
        </>
      )}

      {featureTogglesLoaded &&
        !showUnverifiedUserAlert && <HowToApplyPost911GiBillV1 />}
      {featureTogglesLoaded &&
        showUnverifiedUserAlert && <HowToApplyPost911GiBillV2 route={route} />}

      <h2>Follow these steps to get started</h2>
      {!showMebDgi40Features && <IntroductionProcessListV1 />}
      {showMebDgi40Features && <IntroductionProcessListV2 />}

      {!featureTogglesLoaded && <LoadingIndicator />}
      {featureTogglesLoaded &&
        !showUnverifiedUserAlert && <IntroductionLoginV1 route={route} />}
      {featureTogglesLoaded &&
        showUnverifiedUserAlert && <IntroductionLoginV2 route={route} />}

      <OMBInfo resBurden={15} ombNumber="2900-0154" expDate="02/28/2023" />
    </div>
  );
};

IntroductionPage.propTypes = {
  featureTogglesLoaded: PropTypes.bool,
  route: PropTypes.object,
  showMebDgi40Features: PropTypes.bool,
  showUnverifiedUserAlert: PropTypes.bool,
};

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(IntroductionPage);
