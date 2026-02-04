import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAppData } from '../selectors/selectors';
import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import IntroductionLogin from '../components/IntroductionLogin';
import LoadingIndicator from '../components/LoadingIndicator';
import IntroductionProcessList from '../components/IntroductionProcessList';

export const IntroductionPage = ({
  featureTogglesLoaded,
  meb1995Reroute,
  route,
}) => {
  return (
    <div className="schemaform-intro">
      <>
        <h1 className="vads-u-margin-bottom--1p5">
          {meb1995Reroute
            ? 'Apply for VA education benefits'
            : 'Apply for VA education benefits Form 22-1990'}
        </h1>
        <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          {meb1995Reroute
            ? 'Application for VA Education Benefits (VA Form 22-1990)'
            : 'Equal to VA Form 22-1990 (Application for VA Education Benefits)'}
        </h2>
      </>
      <HowToApplyPost911GiBill route={route} />
      <h2>Follow these steps to get started</h2>
      <IntroductionProcessList />
      {!featureTogglesLoaded && <LoadingIndicator />}
      <IntroductionLogin route={route} />
      <va-omb-info
        res-burden={15}
        omb-number="2900-0154"
        exp-date="03/31/2026"
      />
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
    pageList: PropTypes.array,
  }).isRequired,
  featureTogglesLoaded: PropTypes.bool,
  meb1995Reroute: PropTypes.bool,
};

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(IntroductionPage);
