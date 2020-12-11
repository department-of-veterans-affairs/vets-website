import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import {
  selectPatientFacilities,
  selectVAPResidentialAddress,
} from 'platform/user/selectors';

export const selectIsCernerOnlyPatient = state =>
  !!selectPatientFacilities(state)?.every(
    f => f.isCerner && f.usesCernerAppointments,
  );

export const selectIsCernerPatient = state =>
  selectPatientFacilities(state)?.some(
    f => f.isCerner && f.usesCernerAppointments,
  );

export const selectIsRegisteredToSacramentoVA = state =>
  selectPatientFacilities(state)?.some(f => f.facilityId === '612');

export const vaosApplication = state => toggleValues(state).vaOnlineScheduling;
export const vaosCancel = state => toggleValues(state).vaOnlineSchedulingCancel;
export const vaosRequests = state =>
  toggleValues(state).vaOnlineSchedulingRequests;
export const vaosCommunityCare = state =>
  toggleValues(state).vaOnlineSchedulingCommunityCare;
export const vaosDirectScheduling = state =>
  toggleValues(state).vaOnlineSchedulingDirect;
export const vaosPastAppts = state =>
  toggleValues(state).vaOnlineSchedulingPast;
export const vaosVSPAppointmentNew = state =>
  toggleValues(state).vaOnlineSchedulingVspAppointmentNew;
export const vaosExpressCare = state =>
  toggleValues(state).vaOnlineSchedulingExpressCare;
export const vaosExpressCareNew = state =>
  toggleValues(state).vaOnlineSchedulingExpressCareNew;
export const selectFeatureToggleLoading = state => toggleValues(state).loading;
const vaosFlatFacilityPage = state =>
  toggleValues(state).vaOnlineSchedulingFlatFacilityPage;
const vaosFlatFacilityPageSacramento = state =>
  toggleValues(state).vaOnlineSchedulingFlatFacilityPageSacramento;
export const selectUseFlatFacilityPage = state =>
  vaosFlatFacilityPage(state) &&
  !selectIsCernerPatient(state) &&
  (!selectIsRegisteredToSacramentoVA(state) ||
    vaosFlatFacilityPageSacramento(state));

const vaosProviderSelection = state =>
  toggleValues(state).vaOnlineSchedulingProviderSelection;
export const selectUseProviderSelection = state =>
  vaosProviderSelection(state) &&
  !!selectVAPResidentialAddress(state)?.addressLine1;

export const selectIsWelcomeModalDismissed = state =>
  state.announcements.dismissed.some(
    announcement => announcement === 'welcome-to-new-vaos',
  );

export const selectSystemIds = state =>
  selectPatientFacilities(state)?.map(f => f.facilityId) || null;
