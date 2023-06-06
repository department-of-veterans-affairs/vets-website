import moment from 'moment';

import {
  mockAppointmentSlotFetch,
  mockEligibilityFetches,
} from '../../../mocks/helpers';
import { getAppointmentSlotMock, getClinicMock } from '../../../mocks/v0';
import { mockEligibilityFetchesByVersion } from '../../../mocks/fetch';

export function setDateTimeSelectMockFetches({
  preferredDate = moment(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  const clinicIds = Object.keys(slotDatesByClinicId);
  const clinics = [
    {
      id: clinicIds[0],
      attributes: {
        ...getClinicMock(),
        siteCode: '983',
        clinicId: clinicIds[0],
        institutionCode: '983',
        clinicFriendlyLocationName: 'Green team clinic',
      },
    },
    {
      id: clinicIds[1],
      attributes: {
        ...getClinicMock(),
        siteCode: '983',
        clinicId: clinicIds[1],
        institutionCode: '983',
        clinicFriendlyLocationName: 'Red team clinic',
      },
    },
  ];

  // TODO: Remove this when the following API call has been migrated (mocks/helpers.js:511):
  // ../vaos/v0/facilities/${facilityId}/clinics?type_of_care_id=${typeOfCareId}&system_id=${siteId}`,
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

  mockEligibilityFetchesByVersion({
    facilityId: '983',
    typeOfCareId: 'primaryCare',
    limit: true,
    requestPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });
  mockEligibilityFetchesByVersion({
    facilityId: '983',
    typeOfCareId: 'primaryCare',
    limit: true,
    directPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });

  if (!slotError) {
    clinicIds.forEach(id => {
      const slots = slotDatesByClinicId[id].map(date => {
        return {
          ...getAppointmentSlotMock(),
          startDateTime: date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          endDateTime: date
            .clone()
            .minute(20)
            .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        };
      });
      mockAppointmentSlotFetch({
        siteId: '983',
        clinicId: id,
        typeOfCareId: '323',
        slots,
        preferredDate,
      });
    });
  }
}
