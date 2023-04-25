import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { makeSelectFeatureToggles } from '../selectors/feature-toggles';

export default function App() {
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { checkInUnifiedExperience } = useSelector(selectFeatureToggles);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('id');
  const app = urlParams.get('app');
  if (checkInUnifiedExperience) {
    window.location.replace(
      `/health-care/appointment-pre-check-in?id=${token}&app=unified`,
    );
  }

  if (app === 'preCheckIn') {
    window.location.replace(
      `/health-care/appointment-pre-check-in?id=${token}`,
    );
  }
  window.location.replace(`/health-care/appointment-check-in?id=${token}`);

  return <va-loading-indicator />;
}
