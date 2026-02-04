import React, { useEffect, useCallback } from 'react';
import { Prompt, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { openModal, clearMostRecentlySavedField } from '@@vap-svc/actions';

import { focusElement } from '~/platform/utilities/ui';
import { PROFILE_PATH_NAMES } from '../../constants';

import Headline from '../ProfileSectionHeadline';
import SchedulingPreferencesContent from './SchedulingPreferencesContent';

const SchedulingPreferences = () => {
  const location = useLocation();
  const hasSchedulingPreferencesError =
    useSelector(state => state.vaProfile?.schedulingPreferences?.error) ??
    false;
  const isLoading =
    useSelector(state => state.vaProfile?.schedulingPreferences?.loading) ??
    false;

  const hasUnsavedEdits = useSelector(
    state => state.vapService?.hasUnsavedEdits,
  );

  const dispatch = useDispatch();
  const clearSuccessAlert = useCallback(
    () => dispatch(clearMostRecentlySavedField()),
    [dispatch],
  );
  const openEditModal = useCallback(() => dispatch(openModal()), [dispatch]);

  useEffect(
    () => {
      document.title = `Scheduling Preferences | Veterans Affairs`;

      return () => {
        clearSuccessAlert();
      };
    },
    [clearSuccessAlert],
  );

  useEffect(
    () => {
      if (location.hash) {
        // Set focus on the page heading
        const focusTarget = document.querySelector(location.hash);
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
      // Show alert when navigating away with unsaved edits
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
        when={hasUnsavedEdits}
        message="You have unsaved changes. Are you sure you want to leave?"
      />

      <Headline
        dataTestId="scheduling-preferences-page-headline"
        classes={
          hasSchedulingPreferencesError
            ? 'vads-u-margin-bottom--4'
            : 'vads-u-margin-bottom--1'
        }
      >
        {PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
      </Headline>
      <SchedulingPreferencesContent
        hasSchedulingPreferencesError={hasSchedulingPreferencesError}
        isLoading={isLoading}
      />
    </>
  );
};

SchedulingPreferences.propTypes = {};

export default SchedulingPreferences;
