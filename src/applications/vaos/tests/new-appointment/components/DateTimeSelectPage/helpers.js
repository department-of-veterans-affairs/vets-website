import moment from 'moment';

import {
  mockAppointmentSlotFetch,
  mockEligibilityFetches,
} from '../../../mocks/helpers';
import { getAppointmentSlotMock, getClinicMock } from '../../../mocks/v0';

export function setDateTimeSelectMockFetches({
  preferredDate = moment(),
  singleClinic = false,
  singleSlot = false,
  slotError = false,
  slotsToSet = [],
} = {}) {
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
    clinics: singleClinic ? [clinics[0]] : clinics,
    pastClinics: true,
  });
  if (!slotError) {
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const slot309Date = moment()
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);

    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: '323',
      slots: slotsToSet.length
        ? slotsToSet
        : [
            {
              ...getAppointmentSlotMock(),
              startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
              endDateTime: slot308Date
                .clone()
                .minute(20)
                .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
            },
          ],
      preferredDate,
    });
    if (!singleSlot) {
      mockAppointmentSlotFetch({
        siteId: '983',
        clinicId: '309',
        typeOfCareId: '323',
        slots: [
          {
            ...getAppointmentSlotMock(),
            startDateTime: slot309Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
            endDateTime: slot309Date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
          },
        ],
        preferredDate,
      });
    }
  }
}
