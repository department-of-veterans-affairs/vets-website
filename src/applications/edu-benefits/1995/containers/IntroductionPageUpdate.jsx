import React from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { connect } from 'react-redux';
import { showEduBenefits1995Wizard } from 'applications/edu-benefits/selectors/educationWizard';

import {
  WIZARD_STATUS,
  WIZARD_STATUS_NOT_STARTED,
} from 'platform/site-wide/wizard';

export class IntroductionPageUpdate extends React.Component {
  state = {
    status: sessionStorage.getItem(WIZARD_STATUS) || WIZARD_STATUS_NOT_STARTED,
  };

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  setWizardStatus = value => {
    sessionStorage.setItem(WIZARD_STATUS, value);
    this.setState({ status: value });
  };

  renderSaveInProgressIntro = buttonOnly => (
    <SaveInProgressIntro
      buttonOnly={buttonOnly}
      prefillEnabled={this.props.route.formConfig.prefillEnabled}
      messages={this.props.route.formConfig.savedFormMessages}
      pageList={this.props.route.pageList}
      startText="Start the education application"
      unauthStartText="Sign in or create an account"
    />
  );

  render() {
    const { showWizard } = this.props;

    if (showWizard === undefined) return null;

    return (
      <div
        className="schemaform-intro"
        itemScope
        itemType="http://schema.org/HowTo"
      >
        <FormTitle title="Change your education benefits" />
        <p itemProp="description" className="vads-u-font-size--lg">
          Equal to VA Form 22-1995 (Request for Change of Benefit, Program or
          Place of Training).
        </p>
        <p className="vads-u-font-size--lg">
          <span className="vads-u-font-weight--bold">Note: </span>
          As of August 12, 2024, we combined VA Form-22-1995 with VA Form
          22-5495 to better serve you and your families.
        </p>
        <h2 className="vads-u-margin-top--4">
          What to know before you fill out this form
        </h2>
        <p>Here’s what you’ll need to change your education benefits:</p>
        <ul>
          <li>Social Security number</li>
          <li>
            Basic information about the school or training facility you want to
            attend
          </li>
          <li>
            Bank account direct deposit information (if adding or changing an
            account)
          </li>
          <li>Military history</li>
          <li>
            Benefit you have most recently used and benefit you want to change
            to
          </li>
        </ul>
        <p>
          Depending on your situation, you may need to include these details:
        </p>
        <ul>
          <li>
            Sponsor information for the DEA Chapter 35 benefit if you use it or
            want to use it
          </li>
          <li>Guardian information for applicants under the age of 18</li>
        </ul>
        <h2 className="vads-u-margin-top--4">
          What if I need help filling out this form?
        </h2>
        <p>
          An accredited representative can help you. You can work with a
          Veterans Service Organization (VSO) representative or a Veteran
          representative at your school. <br />
          <va-link
            text="Learn more about getting help from an accredited representative"
            href="https://www.va.gov/get-help-from-accredited-representative/"
          />
        </p>
        <h2 className="vads-u-margin-top--4">What happens next</h2>
        <p>
          After submitting your request, we’ll send you a confirmation message
          you can print for your records.{' '}
        </p>
        <p>
          We usually process requests within 30 days. We’ll let you know by mail
          if we need more information.
        </p>
        <p>
          If we approve your request, you’ll get a Certificate of Eligibility
          (COE) in the mail. Bring this COE to the VA certifying official at
          your school. This person is usually in the Registrar or Financial Aid
          office at your school.
        </p>
        <p>
          You’ll only get a COE if we approve your request. If we don’t approve
          your request, you’ll get a denial letter instead.
        </p>

        <div className="subway-map">
          {this.renderSaveInProgressIntro()}
          <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
            <va-omb-info
              res-burden={20}
              omb-number="2900-0074"
              exp-date="09/30/2027"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showWizard: showEduBenefits1995Wizard(state),
});

IntroductionPageUpdate.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
  showWizard: PropTypes.bool,
};

export default connect(mapStateToProps)(IntroductionPageUpdate);
