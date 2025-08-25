import React, { useEffect } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 24;
const OMB_NUMBER = '2900-0219';
const OMB_EXP_DATE = '12/31/2027';

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>Make sure you meet our eligibility requirements before you apply.</p>
        <va-link
          text="Find out if you’re eligible for CHAMPVA benefits"
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/"
        />
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>
          <b>You’ll need to provide personal information for these people:</b>
        </p>
        <ul>
          <li>Yourself, and</li>
          <li>Anyone you’re applying for, and</li>
          <li>
            Your sponsor (the Veteran or service member you’re connected to)
          </li>
        </ul>
        <p>
          Personal information may include dates of birth, Social Security
          numbers, and contact information.
        </p>
        <p>
          You’ll also need to submit these supporting documents if appropriate:
        </p>
        <ul>
          <li>Health insurance cards</li>
          <li>Medicare cards</li>
          <li>Proof of school enrollment</li>
          <li>Proof of marriage or legal union</li>
          <li>Proof of adoption</li>
          <li>Birth certificate of dependent(s)</li>
        </ul>
        <va-link
          text="Find out which documents you’ll need to apply for CHAMPVA"
          href="https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
        />
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about{' '}
          {OMB_RES_BURDEN} minutes.
        </p>
      </va-process-list-item>
      <va-process-list-item header="After you apply">
        <p>We’ll contact you if we have questions or need more information.</p>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p>
        If you’re the spouse, dependant, or survivor of a Veteran or service
        member who meets certain requirements, you may qualify for health
        insurance through the Civilian Health and Medical Program of the
        Department of Veterans Affairs (CHAMPVA).
      </p>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started
      </h2>
      <ProcessList />
      <va-alert-sign-in variant="signInOptionalNoPrefill" visible>
        <span slot="SignInButton">
          <VaButton
            text="Sign in or create an account"
            onClick={() => props.toggleLoginModal(true)}
          />

          <p>
            <Link
              to={pageList?.[1]?.path}
              className="schemaform-start-button"
              aria-label="test-aria-label"
              aria-describedby="test-aria-desc-by"
            >
              Start your {formConfig?.customText?.appType} without signing in
            </Link>
          </p>
        </span>
      </va-alert-sign-in>
      <p />
      <h3>Additional form you may need to complete</h3>
      <h3>CHAMPVA other health insurance (OHI) certification</h3>
      <p>VA form 10-7959c</p>
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
      customText: PropTypes.shape({ appType: PropTypes.string }),
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  toggleLoginModal: PropTypes.func,
};

const mapDispatchToProps = {
  toggleLoginModal,
};

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user.login.currentlyLoggedIn,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
