import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle title="10-10d" subtitle="Equal to VA Form 10-10D (10-10d)" />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the 10-10D form to apply for benefits.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for benefits.
        </h2>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
            <h4>To fill out this application, you’ll need your:</h4>
            <ul>
              <li>Sponsor Information(required)</li>
              <li>All applicants information</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </va-process-list>
        <ul>
          <li>
            <h3>Definitions</h3>
            <p>
              <strong>Medicare Impact.</strong> If you are eligible or become
              eligible for Medicare Part A and you are under age 65, you MUST
              have Part B to be covered by CHAMPVA. Effective October 1, 2001,
              CHAMPVA benefits were extended to beneficiaries age 65 or older.
              If you are eligible for Medicare Part A and you are age 65 or
              older, you are required to have Part B to be covered by CHAMPVA if
              your 65th birthday was on or after June 5, 2001, or if you were
              already enrolled in Part B prior to June 5, 2001.{' '}
            </p>
            <p>
              <strong>Service-connected condition/disability</strong> Refers to
              a VA determination that a veteran illness or injury was incurred
              or aggravated while on active duty in military service and
              resulted in some degree of disability.
            </p>
            <p>
              <strong>Sponsor</strong> Refers to the veteran upon whom CHAMPVA
              eligibility for the applicant is based.
            </p>
            <p>
              <strong>Spouse</strong> Refers to a person who is married to or is
              a widow(er) of an eligible CHAMPVA sponsor. If you are certifying
              that a person is your spouse for the purpose of VA benefits, your
              marriage must be recognized by the place where you and/or your
              spouse resided at the time of marriage, or where you and/or your
              spouse reside when you file your claim (or at a later date when
              you become eligible for benefits) (38 U.S.C. 103(c)). Additional
              guidance on when VA recognizes marriages is available at
              http://www.va.gov/opa/marriage/. If the spouse remarries prior to
              age 55, CHAMPVA benefits end on the date of the remarriage.
              Effective February 4, 2003, if the spouse remarries on or after
              age 55, CHAMPVA benefits continue. Additionally, in some
              instances, a remarried surviving spouse whose remarriage is either
              terminated by death, divorce or annulment is CHAMPVA eligible when
              supported by a copy of the appropriate documentation (death
              certificate/divorce decree/annulment certification).
            </p>
            <p>
              <strong>Child</strong> Includes legitimate, adopted, illegitimate,
              and stepchildren. To be eligible, the child must be unmarried and:
              1) under the age of 18; or 2) who, before reaching age 18, became
              permanently incapable of self-support as rated by a VA regional
              office; or 3) who, after reaching age 18 and continuing up to age
              23, is enrolled in a full-time course of instruction at an
              approved educational institution---school certification required
              (see below).
              <br />
              <strong>Note:</strong> Except for stepchildren, the eligibility of
              children is not affected by divorce or remarriage of the spouse or
              surviving spouse.
            </p>
          </li>
        </ul>
        <SaveInProgressIntro
          buttonOnly
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        />
        <p />
        <OMBInfo resBurden={30} ombNumber="10-10d" expDate="12/31/2023" />
      </article>
    );
  }
}

export default IntroductionPage;
