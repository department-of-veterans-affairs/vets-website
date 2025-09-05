import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 840;
const OMB_NUMBER = '2900-0718 ';
const OMB_EXP_DATE = '01/31/2028';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Complete the form">
        <p>
          Start by completing VA Form 22-0839 online. You’ll begin by selecting
          the type of agreement your school wants to submit:
        </p>
        <ul>
          <li>A new open-ended agreement</li>
          <li>A request to modify an existing agreement</li>
          <li>A request to withdraw from the Yellow Ribbon Program</li>
        </ul>
        <p>
          Next, provide details about your school’s Yellow Ribbon Program
          contributions.
        </p>
        <ul>
          <li>
            U.S. schools must include the maximum number of students, degree
            level, college or professional school, and maximum contribution
            amount per student.
          </li>
          <li>
            Foreign schools must include the maximum number of students, degree
            level, the currency type used for billing, and maximum contribution
            amount per student.
          </li>
        </ul>
        <p>
          At the end, the authorized official will review and acknowledge the
          terms of participation.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Submit the form">
        <p>
          After you complete the form, it will be automatically sent to VA for
          processing.
        </p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route } = props;
  const { formConfig, pageList } = route;
  // const showVerifyIdentify = true;
  const showVerifyIdentify = userLoggedIn && !userIdVerified;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <va-banner
        data-label="Info banner"
        type="info"
        headline="For educational institutions only"
        visible
      >
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> This form is intended for educational
          institutions and training facilities submitting reports regarding
          school certifying officials.
        </p>
      </va-banner>

      <h2 className=" vads-u-margin-top--4">
        What to know before you fill out this form
      </h2>
      <ul>
        <li>
          If your school doesn’t want to participate in the Yellow Ribbon
          Program, you don’t need to submit this form.
        </li>
        <li>
          Schools must submit a new agreement each academic year to stay in the
          program, even if nothing is changing.
        </li>
        <li>
          U.S. schools can submit this form from March 15 through May 15 (or the
          following Monday if May 15 falls on a weekend).
        </li>
        <li>
          Foreign schools can submit this form from June 1 through July 31 (or
          the following Monday if July 31 falls on a weekend).
        </li>
      </ul>
      <p>
        <va-link
          external
          text="Review additional instructions for the Yellow Ribbon Program Agreement"
          href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
        />
      </p>
      <va-summary-box>
        <h3 slot="headline">Submission guidelines</h3>
        <ul>
          <li>
            This form must be completed and signed by a school official who is
            authorized to enter into financial agreements on behalf of the
            school. This applies to both U.S. and foreign schools.
          </li>
          <li>
            The authorized official will be required to review and acknowledge a
            series of statements confirming that the school understands and
            agrees to the terms of participating in the Yellow Ribbon Program.
            These include statements about funding, reporting requirements, and
            maintaining records.
          </li>
        </ul>
      </va-summary-box>
      <h2 className="vads-u-margin-top--4">
        How do I submit my Yellow Ribbon Agreement?
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        // <div>{/* add verify identity alert if applicable */}</div>
        <>
          <h2>Start the form</h2>
          <va-banner data-label="Info banner" type="info" visible>
            <p>
              You can save this form in progress, and come back later to finish
              filling it out.
            </p>
          </va-banner>
        </>
      ) : (
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the application"
          devOnly={{
            forceShowFormControls: true,
          }}
        />
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
