import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getPreviousPagePath, goBack, getRoute } from '../routing';
import { setData as setDataAction } from '../actions';

/**
 * Equivalent to back button on the back/continue pair,
 * but a link instead of a button
 *
 * Usage:
 * ```jsx
 * <BackLink />
 * ```
 *
 * BackLink vs BackLinkImpl
 * BackLink is what you should use as a consumer
 * BackLinkImpl is for testing so we can pass in props directly
 */
export const BackLinkImpl = ({
  text = 'Back to previous page',
  router, // from withRouter or manually passed for testing
  routes, // from withRouter or manually passed for testing
  location, // from withRouter or manually passed for testing
  form, // from connect
  setData, // from connect
}) => {
  const [href, setHref] = useState(null);

  useEffect(
    () => {
      if (!routes || !form.data || !location.pathname) {
        return;
      }
      try {
        let newHref;
        const route = getRoute(routes, location);

        if (typeof route.pageConfig?.onNavBack === 'function') {
          // if onNavBack is defined, then the consumer is doing
          // something custom and we can't determine the newHref,
          // possibly including side effects like setting data
          newHref = '#';
        } else {
          newHref = getPreviousPagePath(
            route.pageList,
            form.data,
            location.pathname,
          );
        }

        setHref(newHref);
      } catch (e) {
        // possible if we're already on first page
        setHref(null);
      }
    },
    [location, form.data, routes, form, setData],
  );

  function onClick(e) {
    e.preventDefault();

    const route = getRoute(routes, location);

    goBack({
      formData: form.data,
      index: router.params?.index ? Number(router.params.index) : undefined,
      location,
      onNavBack: route?.pageConfig?.onNavBack,
      pageList: route?.pageList,
      router,
      setData,
    });
  }

  if (!href) {
    return null;
  }

  return (
    <nav
      className="vads-u-margin-top--2 vads-u-margin-bottom--4"
      aria-label="Previous page"
    >
      <va-link back href={href} text={text} onClick={onClick} />
    </nav>
  );
};

// Hook-based BackLink component
const BackLinkHooks = ({ text = 'Back to previous page', form, setData }) => {
  const history = useHistory();
  const location = useLocation();

  // Create router object compatible with legacy API
  const router = {
    push: history.push,
    replace: history.replace,
    params: {}, // React Router v5 uses useParams() hook, but this would need route context
  };

  // For routes, we'd need access to the route configuration
  // This is a limitation - we might need to pass routes as a prop or context
  const routes = []; // TODO: This needs to be passed from route configuration

  return (
    <BackLinkImpl
      text={text}
      router={router}
      routes={routes}
      location={location}
      form={form}
      setData={setData}
    />
  );
};

BackLinkHooks.propTypes = {
  form: PropTypes.object,
  setData: PropTypes.func,
  text: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

const mapDispatchToProps = {
  setData: setDataAction,
};

BackLinkImpl.propTypes = {
  form: PropTypes.object, // from connect
  location: PropTypes.object, // from withRouter
  router: PropTypes.object, // from withRouter
  routes: PropTypes.array, // from withRouter
  setData: PropTypes.func, // from connect
  text: PropTypes.string,
};

const BackLink = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackLinkHooks);

export default BackLink;
