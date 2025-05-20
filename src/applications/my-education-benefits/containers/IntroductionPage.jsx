import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAppData } from '../selectors/selectors';
import HowToApplyPost911GiBill from '../components/HowToApplyPost911GiBill';
import IntroductionLogin from '../components/IntroductionLogin';
import LoadingIndicator from '../components/LoadingIndicator';
import IntroductionProcessList from '../components/IntroductionProcessList';

export const IntroductionPage = ({ featureTogglesLoaded, route }) => {
  return (
    <div className="schemaform-intro">
      <>
        <h1 className="vads-u-margin-bottom--1p5">
          Apply for VA education benefits Form 22-1990
        </h1>
        <h2 className="vads-u-font-size--h3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--0">
          Equal to VA Form 22-1990 (Application for VA Education Benefits)
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

      <div className="vads-u-padding--0 vads-u-margin-top--4 vads-u-margin-bottom--2">
        <h2>Need help?</h2>
        <p>
          If you need help with your application or have questions about
          enrollment or eligibility, submit a request with{' '}
          <a
            href="https://ask.va.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask VA
          </a>
          .
        </p>
        <p>
          If you have technical difficulties using this online application,
          MyVA411 main information line at{' '}
          <va-telephone contact="8006982411" extension="711" />. We’re here
          24/7.
        </p>
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
    pageList: PropTypes.array,
  }).isRequired,
  featureTogglesLoaded: PropTypes.bool,
};

const mapStateToProps = state => getAppData(state);

export default connect(mapStateToProps)(IntroductionPage);
