import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_RESTARTING } from 'platform/site-wide/wizard';
import { itfNotice } from '../content/introductionPage';
import { show526Wizard, isBDD, getPageTitle, getStartText } from '../utils';
import {
  BDD_INFO_URL,
  DISABILITY_526_V2_ROOT_URL,
  ITF_NOTICE_TEXT,
  WIZARD_STATUS,
  PAGE_TITLE_SUFFIX,
  DOCUMENT_TITLE_SUFFIX,
  DBQ_URL,
  OMB_CONTROL,
} from '../constants';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('h1');
    scrollToTop();
  }

  render() {
    const { route, loggedIn, formId, isBDDForm, showWizard } = this.props;
    const { formConfig, pageList } = route;
    const pageTitle = `${getPageTitle(isBDDForm)} ${PAGE_TITLE_SUFFIX}`;
    const startText = getStartText(isBDDForm);
    document.title = `${pageTitle}${DOCUMENT_TITLE_SUFFIX}`;

    const subwayTitle = `Follow the steps on this page to file ${
      isBDDForm
        ? 'a BDD claim.'
        : 'a claim for a new or secondary condition or for increased disability compensation.'
    }`;

    const handler = {
      startOver: () => {
        sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_RESTARTING);
        recordEvent({ event: 'howToWizard-start-over' });
      },
    };

    const sipProps = {
      hideUnauthedStartLink: true,
      headingLevel: 2,
      prefillEnabled: formConfig.prefillEnabled,
      formId,
      formConfig,
      pageList,
      startText,
      downtime: formConfig.downtime,
      retentionPeriod: '1 year',
      ariaDescribedby: 'main-content',
      buttonAriaDescribedby: ITF_NOTICE_TEXT,
    };

    return (
      <div className="schemaform-intro">
        <FormTitle title={pageTitle} />
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
            <va-link
              href={BDD_INFO_URL}
              text="Learn more about Benefits Delivery at Discharge (BDD)"
            />
            <p />
          </>
        ) : (
          <p>
            Application for Disability Compensation and Related Compensation
            Benefits (VA Form 21-526EZ)
          </p>
        )}
        <SaveInProgressIntro {...sipProps} />
        {itfNotice}
        <h2 id="main-content">{subwayTitle}</h2>
        <div className="process schemaform-process">
          {loggedIn && (
            <p id="restart-wizard" className="vads-u-margin-top--0">
              if you don’t think this is the right form for you,{' '}
              <va-link
                aria-describedby="restart-wizard"
                href={
                  showWizard
                    ? `${DISABILITY_526_V2_ROOT_URL}/start`
                    : '/disability/how-to-file-claim/'
                }
                onClick={handler.startOver}
                text="go back and answer questions again"
              />
              .
            </p>
          )}
          <va-alert status="info">
            <h3 className="vads-u-padding-top--0">Notice of evidence needed</h3>
            <p>
              We’re required by law to tell you what evidence you’ll need to
              submit to support your disability claim.
            </p>
            <p>
              You can review the evidence requirements on our evidence needed
              for your disability claim page.
            </p>
            <p>
              <va-link
                external
                href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
                text="Review the evidence requirements"
              />
            </p>
          </va-alert>
          <va-process-list class="vads-u-padding-y--0">
            {/* Prepare */}
            <va-process-list-item>
              <h3 className="vads-u-padding-top--0">Prepare</h3>
              {!isBDDForm && (
                <p
                  data-testid="process-step1-prepare"
                  className="vads-u-margin-top--2"
                >
                  When you file a disability claim, you’ll have a chance to
                  provide evidence to support your claim. Evidence could
                  include:
                </p>
              )}
              {isBDDForm && (
                <>
                  <p
                    data-testid="process-step1-prepare"
                    className="vads-u-margin-top--2"
                  >
                    When you file a BDD claim online, we’ll ask you to upload
                    this required form:{' '}
                    <va-link
                      external
                      href={DBQ_URL}
                      text="Separation Health Assessment - Part A Self-Assessment (opens in new tab)"
                    />
                    . We recommend you download and fill out this form on a
                    desktop computer or laptop. Then return to this page to
                    start the application process.
                  </p>
                  <p>
                    <strong>Note:</strong> We estimate that it will take you at
                    least 30 minutes to complete this form.
                  </p>
                  <p>
                    You’ll also have a chance to provide this type of evidence
                    to support your claim:
                  </p>
                </>
              )}
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
                <va-summary-box class="vads-u-margin-bottom--1" uswds>
                  <strong>
                    Please be aware that you’ll need to be available for 45 days
                    after you file a BDD claim to complete a VA exam.
                  </strong>
                </va-summary-box>
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
                    <va-link
                      href="/disability/how-to-file-claim/supplemental-forms/"
                      text="Learn what additional forms you may need to file with your disability claim"
                    />
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
                <va-telephone contact={CONTACTS.VA_BENEFITS} />.
              </p>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
              </p>
              <p>
                <va-link
                  href="/disability/get-help-filing-claim/"
                  text="Get help filing your claim"
                />
                .
              </p>
            </va-process-list-item>
            <va-process-list-item>
              {/* Apply */}
              <h3 className="vads-u-padding-top--0">Apply</h3>
              {isBDDForm ? (
                <>
                  <p
                    data-testid="process-step2-apply"
                    className="vads-u-margin-top--2"
                  >
                    Complete the Benefits Delivery at Discharge form. These are
                    the steps you can expect:
                  </p>
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
                <p
                  data-testid="process-step2-apply"
                  className="vads-u-margin-top--2"
                >
                  Complete this disability compensation benefits form. After
                  submitting the form, you’ll get a confirmation message. You
                  can print this for your records.
                </p>
              )}
            </va-process-list-item>
            <va-process-list-item>
              {/* Review */}
              <h3 className="vads-u-padding-top--0">Review</h3>
              <p
                data-testid="process-step3-vareview"
                className="vads-u-margin-top--2"
              >
                We process applications in the order we receive them. The amount
                of time it takes to process your claim depends on how many
                injuries or disabilities you claim and how long it takes us to
                gather evidence needed to decide your claim.
              </p>
            </va-process-list-item>
            <va-process-list-item>
              {/* Decision */}
              <h3 className="vads-u-padding-top--0">Decision</h3>
              <p
                data-testid="process-step4-decision"
                className="vads-u-margin-top--2"
              >
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </va-process-list-item>
          </va-process-list>
        </div>
        <SaveInProgressIntro buttonOnly {...sipProps} />
        <div className="vads-u-margin-top--2">{itfNotice}</div>
        <va-omb-info
          res-burden={25}
          omb-number={OMB_CONTROL}
          exp-date="11/30/2025"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formId: state.form.formId,
  isBDDForm: isBDD(state?.form?.data),
  loggedIn: isLoggedIn(state),
  showWizard: show526Wizard(state),
});

IntroductionPage.propTypes = {
  formId: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.shape({
        requiredForPrefill: PropTypes.bool,
        dependencies: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
    pageList: PropTypes.array.isRequired,
  }).isRequired,
  isBDDForm: PropTypes.bool,
  loggedIn: PropTypes.bool,
  showWizard: PropTypes.bool,
};

export default connect(mapStateToProps)(IntroductionPage);

export { IntroductionPage };
