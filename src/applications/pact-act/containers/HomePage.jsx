import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';

import { customizeTitle } from '../utilities/customize-title';
import { ROUTES } from '../constants';

const HomePage = ({ router }) => {
  const H1 = 'Page heading';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    waitForRenderThenFocus('h1');
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
        data-testid="pact-act-start-form"
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
};

export default HomePage;
