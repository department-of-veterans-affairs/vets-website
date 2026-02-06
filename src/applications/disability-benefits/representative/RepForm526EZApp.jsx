import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormApp from 'platform/forms-system/src/js/containers/FormApp';
import { isLoggedIn } from 'platform/user/selectors';
import { setData } from 'platform/forms-system/src/js/actions';

// Import ARP layout components
import Footer from '~/applications/accredited-representative-portal/components/Footer';
import SimpleHeader from './components/SimpleHeader';

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
 * - Does NOT use save-in-progress (out of scope for PoC)
 */
export function RepForm526EZApp({ children, location }) {
  const { pathname = '' } = location || {};

  // Set document title
  useEffect(() => {
    document.title = `${FORM_TITLE}${DOCUMENT_TITLE_SUFFIX}`;
  }, []);

  // NOTE: For PoC, we're not requiring login to navigate the form.
  // In production, this should redirect to introduction if not logged in.
  // The representative portal (ARP) handles authentication at a higher level.
  //
  // TODO: Re-enable login check when integrating with ARP authentication
  // const isIntro = pathname.endsWith('/introduction');
  // useEffect(() => {
  //   if (!loggedIn && !isIntro && router) {
  //     router.push('/introduction');
  //   }
  // }, [loggedIn, isIntro, router]);

  return (
    <div className="container">
      <SimpleHeader />
      <article
        id="form-526-representative"
        data-location={pathname?.slice(1)}
        className="vads-u-padding-x--1 medium-screen:vads-u-padding-x--0"
      >
        <FormApp formConfig={formConfig} currentLocation={location}>
          {children}
        </FormApp>
      </article>
      <Footer />
    </div>
  );
}

RepForm526EZApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  // NOTE: loggedIn and router props are commented out for PoC
  // loggedIn: PropTypes.bool,
  // router: PropTypes.shape({
  //   push: PropTypes.func,
  // }),
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
