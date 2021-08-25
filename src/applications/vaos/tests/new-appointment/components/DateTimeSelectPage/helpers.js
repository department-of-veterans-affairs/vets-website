import moment from 'moment';

import {
  mockAppointmentSlotFetch,
  mockEligibilityFetches,
} from '../../../mocks/helpers';
import { getClinicMock } from '../../../mocks/v0';

export function setDateTimeSelectMockFetches({
  preferredDate = moment(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  const clinicIds = Object.keys(slotDatesByClinicId);
  const clinics = [
    {
      id: '308',
      attributes: {
        ...getClinicMock(),
        siteCode: '983',
        clinicId: '308',
        institutionCode: '983',
        clinicFriendlyLocationName: 'Green team clinic',
      },
    },
    {
      id: '309',
      attributes: {
        ...getClinicMock(),
        siteCode: '983',
        clinicId: '309',
        institutionCode: '983',
        clinicFriendlyLocationName: 'Red team clinic',
      },
    },
  ];

  mockEligibilityFetches({
    siteId: '983',
    facilityId: '983',
    typeOfCareId: '323',
    limit: true,
    requestPastVisits: true,
    directPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });
  if (!slotError) {
    clinicIds.forEach(id => {
      mockAppointmentSlotFetch({
        siteId: '983',
        clinicId: id,
        typeOfCareId: '323',
        slots: slotDatesByClinicId[id],
        preferredDate,
      });
    });
  }
}
