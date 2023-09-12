import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';
import { updateIntroPageViewed } from '../actions';
import { pageSetup } from '../utilities/page-setup';

const HomePage = ({ router, setIntroPageViewed }) => {
  const H1 = 'Page heading';

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
      <p>Intro text here TBD</p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        data-testid="paw-start-form"
        href="#"
        className="vads-u-display--block vads-u-margin-top--4 vads-c-action-link--green"
        onClick={startForm}
      >
        Begin
      </a>
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
