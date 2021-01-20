import React from 'react';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import PreferredDatesSection from './PreferredDatesSection';
import PreferredProviderSection from './PreferredProviderSection';
import SelectedProviderSection from './SelectedProviderSection';

export default function CommunityCareSection({
  data,
  vaCityState,
  useProviderSelection,
}) {
  return (
    <>
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      {!useProviderSelection && (
        <PreferredProviderSection data={data} vaCityState={vaCityState} />
      )}
      {useProviderSelection && (
        <SelectedProviderSection data={data} vaCityState={vaCityState} />
      )}
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}
