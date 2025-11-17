import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  getNextPagePath,
  getPreviousPagePath,
} from 'platform/forms-system/src/js/routing';
import { setData } from 'platform/forms-system/src/js/actions';
import { scrollTo } from 'platform/utilities/scroll';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { waitForRenderThenFocus } from 'platform/utilities/ui';

const WhatYouNeedPage = ({
  formData,
  location,
  route,
  router,
  setFormData,
}) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
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

    if (setFormData) {
      setFormData({
        ...formData,
        whatYouNeed: {
          ...formData?.whatYouNeed,
          visited: true,
        },
      });
    }

    const nextPath = getNextPagePath(pageList, formData, currentPath);
    router.push(nextPath);
  };

  return (
    <div className="schemaform-intro">
      <h1 className="vads-u-margin-bottom--2" id="main-content">
        What You Need to Get Started
      </h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        Review this checklist for what you'll need. Don't have everything? You
        can start now and save your progress as you go.
      </p>
      <VaSummaryBox
        id="required-information-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h2 slot="headline">Basic Information</h2>
        <ul className="usa-list vads-u-margin--0">
          <li>Veteran's Name</li>
          <li>Date of Birth</li>
          <li>Social Security Number</li>
          <li>Veteran Service Number</li>
          <li>
            Contact Information (mailing address, email address, phone number)
          </li>
        </ul>
      </VaSummaryBox>
      <VaSummaryBox
        id="required-information-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h2 slot="headline">Employment</h2>
        <ul className="usa-list vads-u-margin--0">
          <li>
            Any employment you've had in the past 12 months, including:
            <ul className="usa-list vads-u-margin-top--1 vads-u-margin-bottom--0 vads-u-padding-left--2">
              <li>Employer names and addresses</li>
              <li>Work dates and hours per week</li>
              <li>Monthly earnings</li>
              <li>Time lost due to illness</li>
            </ul>
          </li>
        </ul>
      </VaSummaryBox>
      <FormNavButtons goBack={goBack} goForward={goForward} />
    </div>
  );
};

WhatYouNeedPage.propTypes = {
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
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WhatYouNeedPage);
