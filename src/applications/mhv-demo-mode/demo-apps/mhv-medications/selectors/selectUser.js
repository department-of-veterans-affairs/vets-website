import { MEDS_BY_MAIL_FACILITY_ID } from '../util/constants';

export const selectUserDob = state => state.user.profile.dob;
export const selectUserFullName = state => state.user.profile.userFullName;
export const selectUserFacility = state => state?.user?.profile?.facilities;

export const selectHasMedsByMailFacility = state =>
  state?.user?.profile?.facilities?.some(
    ({ facilityId }) => facilityId === MEDS_BY_MAIL_FACILITY_ID,
  ) ?? false;
