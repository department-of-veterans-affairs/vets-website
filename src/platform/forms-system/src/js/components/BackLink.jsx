import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getPreviousPagePath, goBack } from '../routing';
import { setData as setDataAction } from '../actions';

function getRoute(routes, location) {
  try {
    return routes.find(r => {
      if (r.path.includes(':index')) {
        const regex = new RegExp(r.path.replace(':index', '\\d+'));
        return regex.test(location.pathname);
      }
      return `/${r.path}` === location.pathname;
    });
  } catch (e) {
    return null;
  }
}

/**
 * Equivalent to back button on the back/continue pair,
 * but a link instead of a button
 *
 * Usage:
 * ```jsx
 * <BackLink />
 * ```
 */
const BackLink = ({ router, routes, location, form, setData }) => {
  const [link, setLink] = useState(null);

  useEffect(
    () => {
      if (!routes || !form.data || !location.pathname) {
        return;
      }
      try {
        const route = getRoute(routes, location);

        let path = getPreviousPagePath(
          route.pageList,
          form.data,
          location.pathname,
        );

        if (typeof route.pageConfig?.onNavBack === 'function') {
          // if onNavBack is defined, then the consumer is doing
          // something custom and we can't determine the path,
          // possibly including side effects like setting data
          path = 'customOnNavBack';
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
        href={link !== 'customOnNavBack' ? link : undefined}
        role={link === 'customOnNavBack' ? 'button' : undefined}
        tabIndex={link === 'customOnNavBack' ? 0 : undefined}
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(BackLink),
);

BackLink.propTypes = {
  form: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
  routes: PropTypes.array,
  setData: PropTypes.func,
};
