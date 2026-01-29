import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

import formConfig from './config/form';

const FORM_TITLE = '21-526EZ Disability Compensation (Representative)';
const DOCUMENT_TITLE_SUFFIX = ' | Veterans Affairs';

/**
 * RepForm526EZApp - Main container for the representative-facing 526EZ form
 *
 * This is a simplified version of the veteran-facing Form526EZApp that:
 * - Does NOT use ITF (Intent to File) wrapper (not needed for PoC)
 * - Does NOT check for veteran MVI identifiers (rep enters veteran info manually)
 * - Uses OGC OAuth for representative authentication (handled by ARP)
 * - Allows representative to enter veteran's identifying information
 */
export function RepForm526EZApp({ children, location, loggedIn, router }) {
  const { pathname = '' } = location || {};

  // Set document title
  document.title = `${FORM_TITLE}${DOCUMENT_TITLE_SUFFIX}`;

  // Redirect to introduction if not logged in and not already there
  const isIntro = pathname.endsWith('/introduction');
  if (!loggedIn && !isIntro) {
    router.push('/introduction');
    return (
      <va-loading-indicator
        message="Redirecting to introduction..."
        label="loading"
      />
    );
  }

  return (
    <article
      id="form-526-representative"
      data-location={pathname?.slice(1)}
      className="vads-u-padding-x--1 medium-screen:vads-u-padding-x--0"
    >
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </article>
  );
}

RepForm526EZApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  loggedIn: PropTypes.bool,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  formData: state.form?.data,
  loggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RepForm526EZApp);
