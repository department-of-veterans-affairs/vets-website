import moment from 'moment';

import { mockAppointmentSlotFetch } from '../../../mocks/helpers';
import { getAppointmentSlotMock } from '../../../mocks/mock';
import { mockEligibilityFetches } from '../../../mocks/fetch';
import { createMockClinic } from '../../../mocks/data';

export function setDateTimeSelectMockFetches({
  typeOfCareId = 'primaryCare',
  preferredDate = moment(),
  slotError = false,
  slotDatesByClinicId = {},
} = {}) {
  const clinicIds = Object.keys(slotDatesByClinicId);
  const clinic1 = createMockClinic({
    id: '308',
    stationId: '983',
    friendlyName: 'Green team clinic',
  });
  const clinic2 = createMockClinic({
    id: '309',
    stationId: '983',
    friendlyName: 'Red team clinic',
  });
  const clinics = [clinic1, clinic2];

  mockEligibilityFetches({
    facilityId: '983',
    typeOfCareId,
    limit: true,
    requestPastVisits: true,
    clinics: clinicIds.length === 2 ? clinics : [clinics[0]],
    pastClinics: true,
  });
  mockEligibilityFetches({
    facilityId: '983',
    typeOfCareId,
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
          attributes: {
            start: date.format('YYYY-MM-DDTHH:mm:ss'),
            end: date
              .clone()
              .minute(20)
              .format('YYYY-MM-DDTHH:mm:ss'),
          },
        };
      });
      mockAppointmentSlotFetch({
        facilityId: '983',
        preferredDate,
        clinicId: id,
        response: slots,
      });
    });
  }
}
