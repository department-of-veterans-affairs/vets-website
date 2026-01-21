import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
  router, // from withRouter
  routes, // from withRouter
  location, // from withRouter
  form, // from connect
  setData, // from connect
  dynamicPaths = false,
}) => {
  const [href, setHref] = useState(null);

  useEffect(
    () => {
      if (!routes || !form.data || !location.pathname) {
        return;
      }
      try {
        let newHref;
        const route = getRoute(routes, location, dynamicPaths);

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

    const route = getRoute(routes, location, dynamicPaths);

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
  dynamicPaths: PropTypes.bool,
};

const BackLink = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(BackLinkImpl),
);

export default BackLink;
