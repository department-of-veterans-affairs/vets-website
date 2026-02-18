import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearMostRecentlySavedField } from '~/platform/user/profile/vap-svc/actions';
import { focusElement } from '~/platform/utilities/ui';
import Headline from './ProfileSectionHeadline';

const getScrollTarget = hash => {
  const hashWithoutLeadingEdit = hash.replace(/^#edit-/, '#');
  return document.querySelector(hashWithoutLeadingEdit);
};

const Tier2PageContent = ({ children, pageHeader }) => {
  const location = useLocation();

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  useEffect(
    () => {
      document.title = `${pageHeader} | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert, pageHeader],
  );

  useEffect(
    () => {
      if (location.hash) {
        // We will always attempt to focus on the element that matches the
        // location.hash
        const focusTarget = document.querySelector(location.hash);
        // But if the hash starts with `edit` we will scroll a different
        // element to the top of the viewport
        const scrollTarget = getScrollTarget(location.hash);
        if (scrollTarget) {
          scrollTarget.scrollIntoView?.();
        }
        if (focusTarget) {
          focusElement(focusTarget);
          return;
        }
      }

      focusElement('[data-focus-target]');
    },
    [location],
  );

  return (
    <>
      <Headline>{pageHeader}</Headline>

      {children}
    </>
  );
};

Tier2PageContent.propTypes = {
  children: PropTypes.node,
  pageHeader: PropTypes.string,
};

export default Tier2PageContent;
