import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { selectAvailableServices } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';

import { itfNotice } from '../content/introductionPage';
import { originalClaimsFeature } from '../config/selectors';
import fileOriginalClaimPage from '../../wizard/pages/file-original-claim';
import { show526Wizard, isBDD, getPageTitle, getStartText } from '../utils';
import {
  BDD_INFO_URL,
  DISABILITY_526_V2_ROOT_URL,
  WIZARD_STATUS,
} from '../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('h1');
    scrollToTop();
  }

  render() {
    const { formConfig, pageList } = this.props.route;
    const services = selectAvailableServices(this.props) || [];
    const allowOriginalClaim =
      this.props.allowOriginalClaim || this.props.testOriginalClaim;
    const allowContinue = services.includes('original-claim')
      ? allowOriginalClaim // original claim feature flag
      : true; // services.includes('form526'); // <- "form526" service should
    // be required to proceed; not changing this now in case it breaks something

    const isBDDForm = this.props.isBDDForm;
    const pageTitle = getPageTitle(isBDDForm);
    const startText = getStartText(isBDDForm);

    // Remove this once form526_original_claims feature flag is removed
    if (!allowContinue) {
      return (
        <div className="schemaform-intro">
          <FormTitle title={pageTitle} subTitle={formConfig.subTitle} />
          <fileOriginalClaimPage.component props={this.props} />
        </div>
      );
    }
    const subwayTitle = `Follow the steps below to file ${
      isBDDForm
        ? 'a BDD claim.'
        : 'a claim for a new or secondary condition or for increased disability compensation.'
    }`;

    return (
      <div className="schemaform-intro">
        <FormTitle title={`${pageTitle} with VA Form 21-526EZ`} />
        {isBDDForm ? (
          <>
            <h2 className="vads-u-font-size--h4">
              Benefits Delivery at Discharge (BDD)
            </h2>
            <p>
              Service members who have an illness or injury that was caused
              &mdash;or made worse&mdash;by their active duty service, can file
              for disability benefits 180 to 90 days before they leave the
              military through the Benefits Delivery at Discharge (BDD) program.
            </p>
            <a href={BDD_INFO_URL}>
              Learn more about Benefits Delivery at Discharge (BDD)
            </a>
            <p />
          </>
        ) : (
          <p>
            Equal to VA Form 21-526EZ (Application for Disability Compensation
            and Related Compensation Benefits).
          </p>
        )}
        <SaveInProgressIntro
          hideUnauthedStartLink
          prefillEnabled={formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={pageList}
          startText={startText}
          retentionPeriod="1 year"
          downtime={formConfig.downtime}
        />
        {itfNotice}
        <h2 className="vads-u-font-size--h4">{subwayTitle}</h2>
        <div className="process schemaform-process">
          <p className="vads-u-margin-top--0">
            if you don’t think this is the right form for you,{' '}
            <a
              href={
                this.props.showWizard
                  ? DISABILITY_526_V2_ROOT_URL
                  : '/disability/how-to-file-claim/'
              }
              className="va-button-link"
              onClick={() => {
                sessionStorage.removeItem(WIZARD_STATUS);
                recordEvent({ event: 'howToWizard-start-over' });
              }}
            >
              go back and answer questions again
            </a>
            .
          </p>
          <ol>
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">Prepare</h3>
              <h4 className="vads-u-font-size--h6">
                When you file a disability claim, you’ll have a chance to
                provide evidence to support your claim. Evidence could include:
              </h4>
              <ul>
                <li>
                  {isBDDForm ? 'Service treatment records, ' : ''}
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
              {isBDDForm ? (
                <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--4">
                  <strong className="usa-alert-body">
                    Please be aware that you’ll need to be available for 45 days
                    after you file a BDD claim to complete a VA exam.
                  </strong>
                </div>
              ) : (
                <>
                  <p>
                    In some cases, you may need to turn in one or more
                    additional forms to support your disability claim. For
                    example, you’ll need to fill out another form if you’re
                    claiming a dependent or applying for aid and attendance
                    benefits.
                  </p>
                  <p>
                    <a href="/disability/how-to-file-claim/supplemental-forms/">
                      Learn what additional forms you may need to file with your
                      disability claim
                    </a>
                    .
                  </p>
                </>
              )}
              <h4 className="vads-u-font-size--h6">
                What if I need help with my application?
              </h4>
              <p>
                If you need help filing a disability claim, you can contact a VA
                regional office and ask to speak to a counselor. To find the
                nearest regional office, please call{' '}
                <Telephone contact={CONTACTS.VA_BENEFITS} />.
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
              {!isBDDForm && (
                <div>
                  <div className="usa-alert usa-alert-info">
                    <div className="usa-alert-body">
                      <h4 className="vads-u-font-size--h6">
                        Disability ratings
                      </h4>
                      <p>
                        For each disability we assign a rating from 0% to 100%.
                        We base this rating on the evidence you turn in with
                        your claim. In some cases we may also ask you to have an
                        exam to help us rate your disability.
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
              )}
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">Apply</h3>
              {isBDDForm ? (
                <>
                  <h4 className="vads-u-font-size--h6">
                    Complete the Benefits Delivery at Discharge form. These are
                    the steps you can expect:
                  </h4>
                  <ul>
                    <li>Provide your service member information</li>
                    <li>Provide your military history</li>
                    <li>
                      Describe the conditions you’re submitting a claim for
                    </li>
                  </ul>
                  After submitting the form, you’ll get a confirmation message.
                  You can print this for your records.
                </>
              ) : (
                <p>
                  Complete this disability compensation benefits form. After
                  submitting the form, you’ll get a confirmation message. You
                  can print this for your records.
                </p>
              )}
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">VA review</h3>
              <p>
                We process applications in the order we receive them. The amount
                of time it takes to process your claim depends on how many
                injuries or disabilities you claim and how long it takes us to
                gather evidence needed to decide your claim.
              </p>
            </li>
            <li className="process-step list-four">
              <h3 className="vads-u-font-size--h4">Decision</h3>
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
          prefillEnabled={formConfig.prefillEnabled}
          formId={this.props.formId}
          pageList={pageList}
          startText={startText}
          downtime={formConfig.downtime}
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
  showWizard: show526Wizard(state),
  isBDDForm: isBDD(state?.form?.data),
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
  showWizard: PropTypes.bool,
  isBDDForm: PropTypes.bool,
};

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };
