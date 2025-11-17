import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { scrollTo } from 'platform/utilities/scroll';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const WhatYouNeed = ({ formData, location, route, router }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  const pageList = route?.pageList || [];
  const currentPath = location?.pathname || '';

  const goBack = () => {
    if (!router?.push) {
      return;
    }

    const previousPath = getPreviousPagePath(pageList, formData, currentPath);
    router.push(previousPath || '/introduction');
  };

  const goForward = () => {
    if (!router?.push) {
      return;
    }
    const nextPath = getNextPagePath(pageList, formData, currentPath);
    router.push(nextPath);
  };

  return (
    <div className="schemaform-intro">
      <h2 className="vads-u-margin-bottom--2">What You Need to Get Started</h2>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        Review this checklist for what you’ll need. Don’t have everything? You
        can start now and save your progress as you go.
      </p>
      <VaSummaryBox
        id="basic-info-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h3 slot="headline">Basic Information</h3>
        <ul className="usa-list vads-u-margin--0">
          <li>Veteran’s name</li>
          <li>Date of birth</li>
          <li>Social Security number</li>
          <li>Veteran’s Service Number</li>
          <li>
            Contact information (mailing address, email address, phone number)
          </li>
        </ul>
      </VaSummaryBox>
      <VaSummaryBox
        id="disability-info-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h3 slot="headline">Disability Information</h3>
        <ul className="usa-list vads-u-margin--0">
          <li>List of your service-connected disabilities</li>
          <li>
            Names and addresses of doctors who treated you in the past 12 months
          </li>
          <li>Dates of recent medical treatment</li>
          <li>Hospital names and dates (if applicable)</li>
        </ul>
      </VaSummaryBox>
      <VaSummaryBox
        id="employment-history-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h3 slot="headline">Employment History</h3>
        <ul className="usa-list vads-u-margin--0">
          <li>Dates your disability began affecting your work</li>
          <li>Date you last worked full-time</li>
          <li>
            Employment details for the past 5 years (employer names, addresses,
            dates, job duties)
          </li>
          <li>Your highest annual earnings and what year</li>
          <li>Current income information (if working)</li>
        </ul>
      </VaSummaryBox>
      <VaSummaryBox
        id="education-training-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h3 slot="headline">Education and Training</h3>
        <ul className="usa-list vads-u-margin--0">
          <li>Highest level of education completed</li>
          <li>Details about any education or training</li>
          <li>Dates of education or training</li>
        </ul>
      </VaSummaryBox>
      <VaSummaryBox
        id="job-search-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h3 slot="headline">Job Search Information</h3>
        <ul className="usa-list vads-u-margin--0">
          <li>Names and addresses of places you applied to work</li>
          <li>Types of jobs you applied for</li>
          <li>Dates you applied</li>
        </ul>
      </VaSummaryBox>
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

WhatYouNeed.propTypes = {
  formData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.shape({
    pageList: PropTypes.array,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(WhatYouNeed);
