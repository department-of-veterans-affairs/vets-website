import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';
import { updateIntroPageViewed } from '../actions';
import { pageSetup } from '../utilities/page-setup';
import { QUESTION_MAP } from '../constants/question-data-map';

const HomePage = ({ router, setIntroPageViewed }) => {
  const H1 = QUESTION_MAP.HOME;

  useEffect(() => {
    pageSetup(H1);
    setIntroPageViewed(true);
  });

  const startForm = event => {
    event.preventDefault();
    router.push(ROUTES.SERVICE_PERIOD);
  };

  return (
    <>
      <h1>{H1}</h1>
      <p>
        The PACT Act is a new law that expands VA benefits and health care for
        Veterans exposed to burn pits, Agent Orange, and other toxic substances.
        And we want to make sure you and your family get the benefits you’ve
        earned and deserve.
      </p>
      <p>Answer a brief series of questions about when and where you served.</p>
      <p>
        We’ll tell you what the PACT Act may mean for your VA benefits—and how
        to apply.
      </p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        data-testid="paw-start-form"
        href="#"
        className="vads-u-display--block vads-u-margin-top--4 vads-c-action-link--green"
        onClick={startForm}
      >
        Get started
      </a>
      <p>
        <strong>Note:</strong> This tool can only provide information and won’t
        start a claim or benefit application.
      </p>
      <p>
        Are you the surviving family member of a Veteran?{' '}
        <a href="/resources/the-pact-act-and-your-va-benefits/#information-for-survivors">
          Get PACT Act information for survivors
        </a>
      </p>
    </>
  );
};

HomePage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setIntroPageViewed: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setIntroPageViewed: updateIntroPageViewed,
};

export default connect(
  null,
  mapDispatchToProps,
)(HomePage);
