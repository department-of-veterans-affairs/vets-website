import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { getPageTitle } from '../../newAppointmentFlow';
import ProviderCard from './ProviderCard';
import ScheduleWithDifferentProvider from './ScheduleWithDifferentProvider';

const pageKey = 'selectProvider';

const providers = [
  {
    name: 'Sarah Bennett, RD',
    lastAppointment: '9/12/2024',
  },
  {
    name: 'Julie Carson, RD',
    lastAppointment: '7/12/2024',
  },
];

export default function SelectProviderPage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
