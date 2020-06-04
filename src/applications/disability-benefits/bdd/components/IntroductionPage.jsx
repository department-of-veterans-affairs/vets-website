import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { BDD_INFO_URL } from '../../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="File for Benefits Delivery at Discharge" />
        <p>
          Service members who have an illness or injury that was caused - or
          made worse - by their active duty service, can file a claim for
          disability benefits 180 to 90 days before they leave the military
          through the Benefits Delivery at Discharge (BDD) program.
        </p>
        <p>
          <a href={BDD_INFO_URL}>
            Learn more about Benefits Delivery at Discharge (BDD)
          </a>
        </p>
        <SaveInProgressIntro
          hideUnauthedStartLink
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={this.props.route.pageList}
          startText="Start a Benefits Delivery at Discharge claim"
          retentionPeriod="1 year"
          downtime={this.props.route.formConfig.downtime}
        />
        <h4>Follow the steps below to file a BDD claim.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>
                  When you file a disability claim, you’ll have a chance to
                  provide evidence to support your claim. Evidence could
                  include:
                </h6>
              </div>
              <ul>
                <li>
                  VA medical records and hospital records that relate to your
                  claimed condition or that show your rated disability has
                  gotten worse
                </li>
                <li>
                  Private medical records and hospital reports that relate to
                  your claimed condition or that show your disability has gotten
                  worse
                </li>
                <li>
                  Supporting statements from family, friends, coworkers, clergy,
                  or law enforcement personnel with knowledge about how and when
                  your disability happened or how it got worse
                </li>
              </ul>
              <p>
                Please be aware that you will need to be available for 45 days
                after you file in order to complete VA exams during this period.
              </p>
              <p>
                If you need help filing a disability claim, you can contact a VA
                regional office and ask to speak to a counselor. To find the
                nearest regional office, please call{' '}
                <a href="tel:18008271000">800-827-1000</a>.
              </p>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
              </p>
              <p>
                <a href="/disability/get-help-filing-claim/">
                  Get help filing your claim
                </a>
                .
              </p>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <div>
                <h6>
                  Complete the Benefits Delivery at Discharge form. These are
                  the steps you can expect:
                </h6>
              </div>
              <ul>
                <li>Provide your Service Member information</li>
                <li>Provide your military history</li>
                <li>
                  Describe the conditions you are submitting (a) claim(s) for
                </li>
              </ul>
              <p>
                After submitting the form, you'll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We process applications in the order we receive them. The amount
                of time it takes to process your claim depends on how many
                injuries or disabilities you claim and how long it takes us to
                gather evidence needed to decide your claim.
              </p>
            </li>
            <li className="process-step list-four">
              <div>
                <h5>Decision</h5>
              </div>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          hideUnauthedStartLink
          buttonOnly
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={this.props.route.pageList}
          startText="Start a Benefits Delivery at Discharge claim"
          downtime={this.props.route.formConfig.downtime}
        />
        <div className="omb-info--container">
          <OMBInfo resBurden={15} ombNumber="2900-0747" expDate="03/31/2021" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { formId: state.form.formId };
}

IntroductionPage.propTypes = {
  formId: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };
