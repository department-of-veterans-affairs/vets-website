import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { stringifyUrlParams } from '../helpers';
import { getPreviousPagePath } from '../routing';
import { setData as setDataAction } from '../actions';

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
        const route = routes.find(r => {
          return `/${r.path}` === location.pathname;
        });

        let path = getPreviousPagePath(
          route.pageList,
          form.data,
          location.pathname,
        );

        if (typeof route.pageConfig?.onNavBack === 'function') {
          route.pageConfig.onNavBack({
            formData: form.data,
            goPath: customPath => {
              path = customPath;
            },
            goPreviousPath: urlParams => {
              const urlParamsString = stringifyUrlParams(urlParams);
              path += urlParamsString || '';
            },
            pageList: route.pageList,
            pathname: location.pathname,
            setFormData: setData,
            urlParams: location.query,
          });
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
    router.push(link);
  }

  if (!link) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
      <a href={link} onClick={onClick} className="vads-u-padding--1">
        <va-icon icon="navigate_before" size={3} />
        Back
      </a>
    </div>
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
