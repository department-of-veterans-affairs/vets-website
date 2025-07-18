import { getIsInPilotReferralStation } from '../utils/pilot';

const useIsInPilotReferralStation = referral => {
  return getIsInPilotReferralStation(referral);
};

export { useIsInPilotReferralStation };
