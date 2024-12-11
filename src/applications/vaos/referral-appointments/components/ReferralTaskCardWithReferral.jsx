import React from 'react';
import { useLocation } from 'react-router-dom';

import { useGetReferralById } from '../hooks/useGetReferralById';
import ReferralTaskCard from './ReferralTaskCard';

export default function ReferralTaskCardWithReferral() {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const id = params.get('id');

  const { currentReferral } = useGetReferralById(id);

  if (!currentReferral) {
    return null;
  }

  return <ReferralTaskCard data={currentReferral} />;
}
