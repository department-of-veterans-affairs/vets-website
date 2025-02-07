import React, { useEffect, useCallback } from 'react';
import { Prompt, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { openModal, clearMostRecentlySavedField } from '@@vap-svc/actions';
import { personalInformationLoadError } from '@@profile/selectors';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';

import Headline from '../ProfileSectionHeadline';
import PersonalInformationContent from './PersonalInformationContent';

// drops the leading `edit` from the hash and looks for that element
const getScrollTarget = hash => {
  const hashWithoutLeadingEdit = hash.replace(/^#edit-/, '#');
  return document.querySelector(hashWithoutLeadingEdit);
};
/**
 *
 *
 * @return {*}
 */
const PersonalInformation = () => {
  const location = useLocation();

  const hasUnsavedEdits = useSelector(
    state => state.vapService.hasUnsavedEdits,
  );

  const hasPersonalInformationServiceError = !!useSelector(
    personalInformationLoadError,
  );

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );

  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      document.title = `Personal Information | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert],
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

  useEffect(
    () => {
      // Show alert when navigating away
      if (hasUnsavedEdits) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [hasUnsavedEdits],
  );

  useEffect(
    () => {
      return () => {
        openEditModal(null);
      };
    },
    [openEditModal],
  );

  return (
    <>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedEdits}
      />

      <Headline>Personal information</Headline>

      <DowntimeNotification
        appTitle="personal information page"
        dependencies={[externalServices.VAPRO_PERSONAL_INFO]}
      >
        <PersonalInformationContent
          hasPersonalInformationServiceError={
            hasPersonalInformationServiceError
          }
        />
      </DowntimeNotification>
    </>
  );
};

PersonalInformation.propTypes = {};

export default PersonalInformation;
