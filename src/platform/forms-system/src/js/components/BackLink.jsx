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
  router, // from withRouter
  routes, // from withRouter
  location, // from withRouter
  form, // from connect
  setData, // from connect
}) => {
  const [link, setLink] = useState(null);

  useEffect(
    () => {
      if (!routes || !form.data || !location.pathname) {
        return;
      }
      try {
        let path;
        const route = getRoute(routes, location);

        if (typeof route.pageConfig?.onNavBack === 'function') {
          // if onNavBack is defined, then the consumer is doing
          // something custom and we can't determine the path,
          // possibly including side effects like setting data
          path = 'customOnNavBack';
        } else {
          path = getPreviousPagePath(
            route.pageList,
            form.data,
            location.pathname,
          );
        }

        setLink(path);
      } catch (e) {
        // possible if we're already on first page
        setLink(null);
      }
    },
    [location, form.data, routes, form, setData],
  );

  function onClick(e) {
    e.preventDefault();

    if (link === 'customOnNavBack') {
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
      return;
    }

    router.push(link);
  }

  if (!link) {
    return null;
  }

  return (
    <nav
      className="vads-u-margin-top--2 vads-u-margin-bottom--4"
      aria-label="Previous page"
    >
      <a
        href={link === 'customOnNavBack' ? '#' : link}
        onClick={onClick}
        className="vads-u-padding--1"
      >
        <va-icon icon="navigate_before" size={3} />
        Back
      </a>
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
  form: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
  routes: PropTypes.array,
  setData: PropTypes.func,
};

const BackLink = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(BackLinkImpl),
);

export default BackLink;
