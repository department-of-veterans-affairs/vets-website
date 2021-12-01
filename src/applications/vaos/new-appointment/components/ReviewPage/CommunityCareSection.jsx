import React from 'react';
import ContactDetailSection from './ContactDetailSection';
import ReasonForAppointmentSection from './ReasonForAppointmentSection';
import PreferredDatesSection from './PreferredDatesSection';
import PreferredProviderSection from './PreferredProviderSection';
import SelectedProviderSection from './SelectedProviderSection';
import { useSelector } from 'react-redux';
import { selectFeatureCCIterations } from '../../../redux/selectors';

export default function CommunityCareSection({ data, vaCityState }) {
  const provider = data.communityCareProvider;
  const hasProvider =
    !!provider && !!Object.keys(data.communityCareProvider).length;
  const myData = { ...data, hasCommunityCareProvider: hasProvider };
  const featureCCIteration = useSelector(selectFeatureCCIterations);

  return (
    <>
      <PreferredDatesSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      {!featureCCIteration && (
        <PreferredProviderSection data={myData} vaCityState={vaCityState} />
      )}
      {featureCCIteration && (
        <SelectedProviderSection data={data} vaCityState={vaCityState} />
      )}
      <ReasonForAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ContactDetailSection data={data} />
    </>
  );
}
