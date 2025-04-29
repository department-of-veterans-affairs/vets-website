import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import SaveInProgressInfo from './SaveInProgressInfo';

export class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route, showWizard } = this.props;
    const { formConfig, pageList } = route;
    const sipProps = { formConfig, pageList };

    if (showWizard === undefined) return null;
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for VA Education Benefits" />
        <p>Equal to VA Form 22-1990 (Application for VA Education Benefits).</p>
        <div className="subway-map">
          <SaveInProgressInfo {...sipProps} route={route} />
          <h2 className="vads-u-font-size--h3">
            Follow the steps below to apply for education benefits.
          </h2>
          <div className="process schemaform-process">
            <ol>
              <li className="process-step list-one">
                <div>
                  <h3>Prepare</h3>
                </div>
                <div>
                  <h4>To fill out this application, you’ll need your:</h4>
                </div>
                <ul>
                  <li>Social Security number (required)</li>
                  <li>Military history (required)</li>
                  <li>
                    Basic information about the school or training facility you
                    want to attend (required)
                  </li>
                  <li>Bank account direct deposit information</li>
                  <li>Education history</li>
                </ul>
                <p>
                  <strong>
                    What if I need help filling out my application?
                  </strong>{' '}
                  An accredited representative, like a Veterans Service Officer
                  (VSO), can help you fill out your claim.{' '}
                  <a href="/disability/get-help-filing-claim/">
                    Find an accredited representative
                  </a>
                  .
                </p>
                <h4>Learn about educational programs</h4>
                <p>
                  See what benefits you’ll get at the school you want to attend.{' '}
                  <a href="/education/gi-bill-comparison-tool/">
                    Use the GI Bill Comparison Tool
                  </a>
                  .
                </p>
              </li>
              <li className="process-step list-two">
                <div>
                  <h4>Apply</h4>
                </div>
                <p>Complete this education benefits form.</p>
                <p>
                  After submitting the form, you’ll get a confirmation message.
                  You can print this for your records.
                </p>
              </li>
              <li className="process-step list-three">
                <div>
                  <h3>VA review</h3>
                </div>
                <p>
                  We usually process claims within 30 days. We’ll let you know
                  by mail if we need more information.
                </p>
                <p>
                  We offer tools and counseling programs to help you make the
                  most of your educational options.{' '}
                  <a href="/education/about-gi-bill-benefits/how-to-use-benefits/">
                    Learn about career counseling options
                  </a>
                </p>
              </li>
              <li className="process-step list-four">
                <div>
                  <h3>Decision</h3>
                </div>
                <p>
                  You’ll get a Certificate of Eligibility (COE), or award
                  letter, in the mail if we've approved your application.
                </p>
                <p>
                  If your application wasn’t approved, you’ll get a denial
                  letter in the mail.
                </p>
              </li>
            </ol>
          </div>
          <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
            <va-omb-info
              res-burden={15}
              omb-number="2900-0154"
              exp-date="03/31/2026"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showWizard: toggleValues(state)[FEATURE_FLAG_NAMES.showEduBenefits1990Wizard],
});

IntroductionPage.propTypes = {
  route: PropTypes.object,
  showWizard: PropTypes.bool,
};

export default connect(mapStateToProps)(IntroductionPage);
