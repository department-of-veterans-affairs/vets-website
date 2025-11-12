import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import App from './containers/App';
import NewApp from './_new-design/containers/NewApp';

const FEATURE_FLIPPER = 'decision_review_sc_redesign_nov2025';

// We'll show the new design when the feature flipper is ON
// When the feature toggles call fails, it falls to the old design
const NewDesignSwitcher = ({ children, location, router }) => {
  return (
    <Toggler toggleName={FEATURE_FLIPPER}>
      <Toggler.Enabled>
        <NewApp location={location} router={router}>
          {children}
        </NewApp>
      </Toggler.Enabled>
      <Toggler.Disabled>
        <App location={location} router={router}>
          {children}
        </App>
      </Toggler.Disabled>
    </Toggler>
  );
};

NewDesignSwitcher.propTypes = {
  children: PropTypes.any,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default NewDesignSwitcher;
