import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for burial benefits" />
        <p>Equal to VA Form 21P-530 (Application for Burial Benefits).</p>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={route.formConfig.prefillEnabled}
          pageList={route.pageList}
          downtime={route.formConfig.downtime}
          startText="Start the Burial Benefits Application"
        />
        <h2 className="vads-u-font-size--h4">
          Follow the steps below to apply for burial benefits.
        </h2>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
            <a
              className="vads-c-action-link--blue"
              href="/burials-memorials/veterans-burial-allowance/"
            >
              Find out if you qualify for a burial allowance
            </a>
            <h4 className="vads-u-margin-top--2p5">
              Needed information about the deceased Veteran
            </h4>
            <p>
              To fill out this application, you’ll need information about the
              deceased Veteran, including their:
            </p>
            <ul>
              <li>Social Security number or VA file number (required)</li>
              <li>Date and place of birth (required)</li>
              <li>Date and place of death (required)</li>
              <li>Military status and history</li>
            </ul>
            <h4>You may need to upload:</h4>
            <ul>
              <li>
                A copy of the deceased Veteran’s DD214 or other separation
                documents
              </li>
              <li>A copy of the Veteran’s death certificate</li>
              <li>
                Documentation for transportation costs (if you’re claiming costs
                for the transportation of the Veteran’s remains)
              </li>
            </ul>
            <h4>What if I need help filling out my application?</h4>
            <p>
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability/get-help-filing-claim/">
                Get help filing your claim
              </a>
              .
            </p>
            <h4>Learn about other survivor and dependent benefits</h4>
            <p>
              If you’re the survivor or dependent of a Veteran who died in the
              line of duty or from a service-related illness, you may be able to
              get a benefit called{' '}
              <a href="/burials-memorials/dependency-indemnity-compensation/">
                Dependency and Indemnity Compensation
              </a>
              .
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this burial benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
            <p>We process claims in the order we receive them.</p>
            <p>We’ll let you know by mail if we need more information.</p>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              After we process your claim, you’ll get a notice in the mail about
              the decision.
            </p>
          </li>
        </va-process-list>
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled={route.formConfig.prefillEnabled}
          pageList={route.pageList}
          startText="Start the Burial Benefits Application"
          downtime={route.formConfig.downtime}
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <va-omb-info
            res-burden={15}
            omb-number="2900-0003"
            exp-date="04/30/2020"
          />
        </div>
      </div>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
};

export default IntroductionPage;
