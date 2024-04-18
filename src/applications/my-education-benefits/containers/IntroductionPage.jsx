import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAppData } from '../selectors/selectors';
import HowToApplyPost911GiBillV2 from '../components/HowToApplyPost911GiBillV2';
import IntroductionLoginV2 from '../components/IntroductionLoginV2';
import LoadingIndicator from '../components/LoadingIndicator';
import IntroductionProcessListV2 from '../components/IntroductionProcessListV2';

export const IntroductionPage = ({ featureTogglesLoaded, route }) => {
  return (
    <div className="schemaform-intro">
      <>
        <h1 className="vads-u-margin-bottom--1p5">
          Apply for VA education benefits
        </h1>
        <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          Equal to VA Form 22-1990 (Application for VA Education Benefits)
        </h2>
      </>
      <HowToApplyPost911GiBillV2 route={route} />
      <h2>Follow these steps to get started</h2>
      <IntroductionProcessListV2 />
      {!featureTogglesLoaded && <LoadingIndicator />}
      <IntroductionLoginV2 route={route} />
      <va-omb-info
        res-burden={15}
        omb-number="2900-0154"
        exp-date="03/31/2026"
      />
    </div>
  );
};

IntroductionPage.propTypes = {
  featureTogglesLoaded: PropTypes.bool,
  route: PropTypes.object,
};

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(IntroductionPage);
