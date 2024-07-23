import {
  VaAlert,
  VaButton,
  VaSearchInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { getNextPagePath } from '@department-of-veterans-affairs/platform-forms-system/routing';
import {
  isLoggedIn,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { toggleLoginModal as toggleLoginModalAction } from '~/platform/site-wide/user-nav/actions';
import { envUrl } from '../constants';
import { inProgressOrReopenedIcon, newIcon, successIcon } from '../helpers';
import DashboardCards from './DashboardCards';

const IntroductionPage = props => {
  const { route, loggedIn, toggleLoginModal } = props;
  const { formConfig, pageList, pathname, formData } = route;
  const [inquiryData, setInquiryData] = useState(false);
  const [searchReferenceNumber, setSearchReferenceNumber] = useState('');
  const [hasError, setHasError] = useState(false);

  const getStartPage = () => {
    const data = formData || {};
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  const showSignInModal = () => {
    toggleLoginModal(true, 'askVA');
  };

  useEffect(
    () => {
      focusElement('.schemaform-title > h1');
    },
    [props],
  );

  const getApiData = url => {
    return apiRequest(url)
      .then(res => {
        setInquiryData(res.data);
      })
      .catch(() => setHasError(true));
  };

  const handleSearchByReferenceNumber = async () => {
    const url = `${envUrl}/ask_va_api/v0/inquiries/${searchReferenceNumber}/status`;
    await getApiData(url);
  };

  const handleSearchInputChange = async e => {
    const searchInputValue = e.target.value;
    setSearchReferenceNumber(searchInputValue);
  };

  const questionStatus = () => {
    if (hasError) {
      return (
        <>
          <p>
            We didn’t find a question with reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            ." Check your reference number and try again.
          </p>
          <p>
            If it still doesn’t work, ask the same question again and include
            your original reference number.
          </p>
        </>
      );
    }

    if (inquiryData?.attributes?.status) {
      const { status } = inquiryData.attributes;
      return (
        <>
          <h3 className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2">
            Showing the status for reference number "
            <span className="vads-u-font-weight--bold">
              {searchReferenceNumber}
            </span>
            "
          </h3>
          <p>
            <span className="vads-u-font-weight--bold">Status: </span> {status}{' '}
            {status === 'Solved' && successIcon}
            {status === 'New' && newIcon}
            {status === 'In progress' && inProgressOrReopenedIcon}
            {status === 'Reopened' && inProgressOrReopenedIcon}
          </p>
          <div className="vads-u-border-left--5px vads-u-border-color--green-light vads-u-padding--0p5">
            {status === 'Solved' && (
              <p className="vads-u-margin-left--2">
                We either answered your question or didn’t have enough
                information to answer your question. If you need more help, ask
                a new question.
              </p>
            )}
            {status === 'New' && (
              <p className="vads-u-margin-left--2">
                We received your question. We’ll review it soon.
              </p>
            )}
            {status === 'In progress' && (
              <p className="vads-u-margin-left--2">
                We’re reviewing your question.
              </p>
            )}
            {status === 'Reopened' && (
              <p className="vads-u-margin-left--2">
                We received your reply. We’ll respond soon.
              </p>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  const unAuthenticatedUI = (
    <>
      <h2 className="vads-u-margin-top--4">How to start</h2>
      <p className="">
        You can use Ask VA to ask a question online. You can ask about
        education, disability compensation, health care and many other topics.
      </p>

      <h3 className="vads-u-margin-top--1">
        If you need personalized information
      </h3>
      <p className="vads-u-margin-bottom--1">
        You need to sign in to ask a question about yourself, your family member
        or another Veteran. Your question can be about many VA-related topics,
        including education benefits, disability compensation, debt, health care
        and more.
      </p>

      <VaAlert
        close-btn-aria-label="Close notification"
        status="continue"
        visible
        uswds
      >
        <h3 slot="headline">Sign in to ask a question</h3>
        <div>
          <p className="vads-u-margin-top--0">
            You’ll need to sign in with a verified{' '}
            <span className="vads-u-font-weight--bold">Login.gov</span> or{' '}
            <span className="vads-u-font-weight--bold">ID.me</span> account or a
            Premium <span className="vads-u-font-weight--bold">DS Logon</span>{' '}
            or{' '}
            <span className="vads-u-font-weight--bold">
              My HealtheVet account.
            </span>{' '}
            If you don’t have any of those accounts, you can create a free{' '}
            <span className="vads-u-font-weight--bold">Login.gov</span> or{' '}
            <span className="vads-u-font-weight--bold">ID.me</span> account now.
          </p>
          <VaButton
            text="Sign in or create an account"
            onClick={showSignInModal}
          />
        </div>
      </VaAlert>

      <h3 className="vads-u-margin-top--6">If you need general information</h3>
      <p className="vads-u-margin-bottom--1">
        We recommend that you use the{' '}
        <Link href="https://www.va.gov/contact-us/virtual-agent/">chatbot</Link>{' '}
        or review <Link href="https://www.va.gov/resources/">FAQs</Link> to find
        general information quickly. Otherwise, you can ask us a question and
        you may not need to sign in.
      </p>
      <Link className="vads-c-action-link--blue" to={getStartPage}>
        Start your question without signing in
      </Link>

      <h2 slot="headline">Only use Ask VA for non-urgent needs</h2>
      <h3 className="vads-u-margin-top--3">
        If you need help now, use one of these urgen communication options
      </h3>
      <ul>
        <li>
          <strong>If you’re in crisis or having thoughts of suicide,</strong>{' '}
          connect with our Veterans Crisis Line. We offer confidential support
          anytime, day or night.{' '}
          <div className="vads-u-margin-top--1 vads-u-margin-bottom--1">
            <va-button
              secondary="true"
              text="Connect with the Veterans Crisis Line"
              href="https://www.veteranscrisisline.net/"
            />
          </div>
        </li>
        <li>
          <strong>If you think your life or health is in danger,</strong> call{' '}
          <va-telephone
            contact="911"
            message-aria-describedby="Emergency care contact number"
          />{' '}
          or go to the nearest emergency room.
        </li>
      </ul>

      <h2>Check the status of your question</h2>
      <p className="vads-u-margin--0">Reference number</p>
      <VaSearchInput
        label="Reference number"
        value={searchReferenceNumber}
        onInput={handleSearchInputChange}
        onSubmit={handleSearchByReferenceNumber}
        uswds
      />
      {questionStatus()}
    </>
  );

  const authenticatedUI = (
    <>
      <SaveInProgressIntro
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        startText="Ask a new question"
      />
      <div className="vads-u-margin-top--5 vads-u-margin-bottom--5">
        <va-accordion
          disable-analytics={{
            value: 'false',
          }}
          open-single
          section-heading={{
            value: 'null',
          }}
          uswds={{
            value: 'true',
          }}
        >
          <va-accordion-item header="When to use Ask VA" id="first">
            <p>
              You can use Ask VA to ask a question online. You can ask about
              education, disability compensation, health care and many other
              topics.
            </p>
            <p>
              If you need help now, use one of these urgent communication
              options:
            </p>
            <ul>
              <li>
                <strong>
                  If you’re in crisis or having thoughts of suicide,
                </strong>{' '}
                connect with our Veterans Crisis Line. We offer confidential
                support anytime, day or night.{' '}
                <a href="https://www.veteranscrisisline.net">
                  Connect with Veterans Crisis Line
                </a>
              </li>
              <li>
                <strong>If you think your life or health is in danger,</strong>{' '}
                call{' '}
                <va-telephone
                  contact="911"
                  message-aria-describedby="Emergency care contact number"
                />
                , or go to the nearest emergency room.
              </li>
            </ul>
          </va-accordion-item>
        </va-accordion>
      </div>

      <DashboardCards />
    </>
  );

  const subTitle =
    'Get answers to your questions about VA benefits and service. You should receive a reply within 7 business days.';

  return (
    <div className="schemaform-intro">
      <FormTitle title={formConfig.title} subTitle={subTitle} />
      {loggedIn ? authenticatedUI : unAuthenticatedUI}
    </div>
  );
};

IntroductionPage.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  profile: PropTypes.shape({
    userFullName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
    }),
    dob: PropTypes.string,
    gender: PropTypes.string,
  }),
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      title: PropTypes.string,
      subTitle: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
      downtime: PropTypes.shape({}),
    }),
    formData: PropTypes.object,
    setFormData: PropTypes.func,
    pathname: PropTypes.string,
    pageList: PropTypes.array,
  }),
};

function mapStateToProps(state) {
  return {
    formData: state.form?.data || {},
    loggedIn: isLoggedIn(state),
    profile: selectProfile(state),
  };
}

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: () => dispatch(toggleLoginModalAction(true)),
  setFormData: setData,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntroductionPage);
