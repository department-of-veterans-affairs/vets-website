import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { selectAvailableServices } from 'platform/user/selectors';

import { itfNotice } from '../content/introductionPage';
import { originalClaimsFeature } from '../config/selectors';
import fileOriginalClaimPage from '../../wizard/pages/file-original-claim';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const services = selectAvailableServices(this.props) || [];
    const allowOriginalClaim =
      this.props.allowOriginalClaim || this.props.testOriginalClaim;
    const allowContinue = services.includes('original-claim')
      ? allowOriginalClaim // original claim feature flag
      : true; // services.includes('form526'); // <- "form526" service should
    // be required to proceed; not changing this now in case it breaks something

    // Remove this once we original claims feature toggle is set to 100%
    if (!allowContinue) {
      return (
        <div className="schemaform-intro">
          <FormTitle title="File for disability compensation" />
          <fileOriginalClaimPage.component props={this.props} />
        </div>
      );
    }
    return (
      <div className="schemaform-intro">
        <FormTitle title="File for disability compensation" />
        <p>
          Equal to VA Form 21-526EZ (Application for Disability Compensation and
          Related Compensation Benefits).
        </p>
        <SaveInProgressIntro
          hideUnauthedStartLink
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={this.props.route.pageList}
          startText="Start the Disability Compensation Application"
          retentionPeriod="1 year"
          downtime={this.props.route.formConfig.downtime}
        />
        {itfNotice}
        <h2 className="vads-u-font-size--h4">
          Follow the steps below to file a claim for a new or secondary
          condition or for increased disability compensation.
        </h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h3 className="vads-u-font-size--h5">Prepare</h3>
              </div>
              <div>
                <h4 className="vads-u-font-size--h6">
                  When you file a disability claim, you’ll have a chance to
                  provide evidence to support your claim. Evidence could
                  include:
                </h4>
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
                In some cases, you may need to turn in one or more additional
                forms to support your disability claim. For example, you’ll need
                to fill out another form if you’re claiming a dependent or
                applying for aid and attendance benefits.
                <br />
                <a href="/disability/how-to-file-claim/supplemental-forms/">
                  Learn what additional forms you may need to file with your
                  disability claim
                </a>
                .
              </p>
              <p>
                <strong>What if I need help with my application?</strong>
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
              <div>
                <div className="usa-alert usa-alert-info">
                  <div className="usa-alert-body">
                    <p>
                      <strong>Disability ratings</strong>
                    </p>
                    <p>
                      For each disability we assign a rating from 0% to 100%. We
                      base this rating on the evidence you turn in with your
                      claim. In some cases we may also ask you to have an exam
                      to help us rate your disability.
                    </p>
                    <p>
                      Before filing a claim for increase, you might want to
                      check to see if you’re already receiving the maximum
                      disability rating for your condition.
                    </p>
                  </div>
                </div>
                <br />
              </div>
            </li>
            <li className="process-step list-two">
              <div>
                <h3 className="vads-u-font-size--h5">Apply</h3>
              </div>
              <p>
                Complete this disability compensation benefits form. After
                submitting the form, you’ll get a confirmation message. You can
                print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h3 className="vads-u-font-size--h5">VA Review</h3>
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
                <h3 className="vads-u-font-size--h5">Decision</h3>
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
          startText="Start the Disability Compensation Application"
          downtime={this.props.route.formConfig.downtime}
        />
        {itfNotice}
        <div className="omb-info--container">
          <OMBInfo resBurden={25} ombNumber="2900-0747" expDate="03/31/2021" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formId: state.form.formId,
  user: state.user,
  allowOriginalClaim: originalClaimsFeature(state),
});

IntroductionPage.propTypes = {
  formId: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
  user: PropTypes.shape({}),
  allowOriginalClaim: PropTypes.bool,
};

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };
