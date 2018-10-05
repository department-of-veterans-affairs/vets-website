import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation/OMBInfo';
import FormTitle from 'us-forms-system/lib/js/components/FormTitle';
import SaveInProgressIntro, {
  introActions,
  introSelector,
} from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for disability compensation" />
        <p>
          Equal to VA Form 21-526EZ (Application for Disability Compensation and
          Related Compensation Benefits).
        </p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={this.props.route.pageList}
          startText="Start the Disability Compensation Application"
          retentionPeriod="1 year"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}
        />
        <h4>
          Follow the steps below to apply for increased disability compensation.
        </h4>
        <div>
          <h4>
            You’ll be submitting an original disability claim, if both of these
            are true:
          </h4>
          <ul className="original-disability-list">
            <li>
              You’re a Veteran or Servicemember who’s between 180 and 90 days
              from ending your military service,{' '}
            </li>
            <span className="list-item-connector">
              <strong>and</strong>
            </span>
            <li>This is the first time you’re filing a disability claim</li>
          </ul>
        </div>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <div>
                <h5>Prepare</h5>
              </div>
              <div>
                <h6>
                  When you apply for disability benefits, be sure to have these
                  on hand:
                </h6>
              </div>
              <ul>
                <li>Your Social Security number</li>
                <li>
                  A copy of your discharge papers (DD214 or other separation
                  documents)
                </li>
                <li>
                  Service treatment records.{' '}
                  <a
                    target="_blank"
                    href="https://www.archives.gov/veterans/military-service-records"
                  >
                    You can order service medical records through the National
                    Archives
                  </a>
                  .
                </li>
                <li>
                  VA medical and hospital records that relate to your illness or
                  injury
                </li>
                <li>
                  Private medical and hospital records that relate to your
                  illness or injury
                </li>
              </ul>
              <p>
                In some cases, you may need to turn in one or more supplemental
                forms to support your claim. For example, you’ll need to fill
                out another form if you’re claiming a dependent or applying for
                aid and attendance benefits.
                <br />
                <a href="/disability-benefits/apply/supplemental-forms/">
                  Learn what additional forms you may need to file with your
                  disability claim
                </a>
                .
              </p>
              <p>
                <strong>What if I need help filling out my application?</strong>
              </p>
              <p>
                If you need help filing a disability claim, you can contact a VA
                regional office and ask to speak to a counselor. To find the
                regional office nearest you, please call{' '}
                <a href="tel:18008778339">1-800-877-8339</a>.
              </p>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
              </p>
              <p>
                <a href="/disability-benefits/apply/help/index.html">
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
                      For each disability claim, we assign a severity rating
                      from 0% to 100%. We base this rating on the supporting
                      documents you turn in with your claim. In some cases we
                      may also ask you to have an exam to help us rate your
                      disability.
                    </p>
                    <p>
                      <a href="/disability-benefits/eligibility/ratings/">
                        Learn how VA assigns disability ratings
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <br />
              </div>
            </li>
            <li className="process-step list-two">
              <div>
                <h5>Apply</h5>
              </div>
              <p>
                Complete this disability compensation benefits form. After
                submitting the form, you’ll get a confirmation message. You can
                print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <div>
                <h5>VA Review</h5>
              </div>
              <p>
                We process applications in the order we receive them. The amount
                of time it takes to process your claim depends how many injuries
                or disabilities you claim and how long it takes us to gather
                evidence needed to decide your claim.
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
          buttonOnly
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={this.props.route.pageList}
          startText="Start the Disability Compensation Application"
          {...this.props.saveInProgressActions}
          {...this.props.saveInProgress}
        />
        <p>
          By clicking the button to start the disability application, you’ll
          declare your intent to file. This will reserve a potential effective
          date for when you could start getting benefits. You have 1 year from
          the day you submit your intent to file to complete your application.
        </p>
        <div className="omb-info--container">
          <OMBInfo resBurden={25} ombNumber="2900-0747" expDate="03/31/2021" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formId: state.form.formId,
    saveInProgress: introSelector(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    saveInProgressActions: bindActionCreators(introActions, dispatch),
  };
}

IntroductionPage.PropTypes = {
  formId: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
  saveInProgress: PropTypes.object.isRequired,
  saveInProgressActions: PropTypes.shape({
    fetchInProgressForm: PropTypes.func.isRequired,
    removeInProgressForm: PropTypes.func.isRequired,
    toggleLoginModal: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);

export { IntroductionPage };
