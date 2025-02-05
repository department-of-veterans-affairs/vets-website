import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
import ProviderCard from './ProviderCard';
import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';

const pageKey = 'selectProvider';

export default function SelectProviderPage({
  providers = [
    {
      name: 'Sarah Bennett, RD',
      lastAppointment: '9/12/2024',
    },
    {
      name: 'Julie Carson, RD',
      lastAppointment: '7/12/2024',
    },
  ],
}) {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const singleProviderTitle = 'Your nutrition and food provider';
  const pageHeader = providers.length > 1 ? pageTitle : singleProviderTitle;

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
    },
    [pageTitle],
  );

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageHeader}</h1>
      <div>
        <strong>Type of care:</strong> Nutrition and Food <br />
        <strong>Facility:</strong> Grove City VA Clinic
      </div>

      {providers.map((provider, index) => (
        <ProviderCard key={index} provider={provider} />
      ))}

      <ScheduleWithDifferentProvider />
    </div>
  );
}

SelectProviderPage.propTypes = {
  providers: PropTypes.array,
};
