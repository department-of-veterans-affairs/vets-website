import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import RecordList from '../components/RecordList/RecordList';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getConditionsList } from '../actions/conditions';
import {
  recordType,
  pageTitles,
  ALERT_TYPE_ERROR,
  accessAlertTypes,
} from '../util/constants';
import { updatePageTitle } from '../../shared/util/helpers';
import AccessTroubleAlertBox from '../components/shared/AccessTroubleAlertBox';

const HealthConditions = () => {
  const conditions = useSelector(state => state.mr.conditions.conditionsList);
  const dispatch = useDispatch();
  const alertList = useSelector(state => state.mr.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState();

  useEffect(
    () => {
      dispatch(getConditionsList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (alertList?.length) {
        const filteredSortedAlerts = alertList
          .filter(alert => alert.isActive)
          .sort((a, b) => {
            // Sort chronologically descending.
            return b.datestamp - a.datestamp;
          });
        if (filteredSortedAlerts.length > 0) {
          // The activeAlert is the most recent alert marked as active.
          setActiveAlert(filteredSortedAlerts[0]);
        }
      }
    },
    [alertList],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs([
          { url: '/my-health/medical-records/', label: 'Medical records' },
        ]),
      );
      focusElement(document.querySelector('h1'));
      updatePageTitle(pageTitles.HEALTH_CONDITIONS_PAGE_TITLE);
    },
    [dispatch],
  );

  const accessAlert = activeAlert && activeAlert.type === ALERT_TYPE_ERROR;

  const content = () => {
    if (accessAlert) {
      return (
        <AccessTroubleAlertBox alertType={accessAlertTypes.HEALTH_CONDITIONS} />
      );
    }
    if (conditions?.length > 0) {
      return (
        <RecordList records={conditions} type={recordType.HEALTH_CONDITIONS} />
      );
    }
    if (conditions?.length === 0) {
      return (
        <div className="vads-u-margin-bottom--3">
          <va-alert background-only status="info">
            You don’t have any records in Health conditions
          </va-alert>
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
    );
  };

  return (
    <>
      <h1 className="vads-u-margin--0">Health conditions</h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--3">
        Health condition records are available{' '}
        <span className="vads-u-font-weight--bold">36 hours</span> after your
        providers enter them.
      </p>
      {content()}
    </>
  );
};

export default HealthConditions;
