import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCovid19VaccineFormPageInfo } from './selectors';

export default function useOpenClinicPage() {
  const pageKey = 'clinicChoice';
  const formPageInfo = useSelector(state =>
    getCovid19VaccineFormPageInfo(state, pageKey),
  );

  useEffect(() => {});

  return { formPageInfo };
}
