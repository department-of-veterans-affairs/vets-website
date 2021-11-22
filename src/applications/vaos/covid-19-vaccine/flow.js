import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../utils/constants';
import { getClinics, showEligibilityModal } from './redux/actions';
import {
  selectCovid19VaccineFormData,
  selectCovid19VaccineNewBooking,
} from './redux/selectors';

export default {
  home: {
    url: '/new-appointment',
  },
  planAhead: {
    url: '/new-covid-19-vaccine-appointment',
    next: 'receivedDoseScreener',
  },
  receivedDoseScreener: {
    url: '/new-covid-19-vaccine-appointment/confirm-doses-received',
    next(state) {
      const formData = selectCovid19VaccineFormData(state);
      if (formData.hasReceivedDose) {
        recordEvent({
          event: `${GA_PREFIX}-covid19-screener-yes`,
        });
        return 'contactFacilities';
      }
      recordEvent({
        event: `${GA_PREFIX}-covid19-screener-no`,
      });
      return 'vaFacility';
    },
  },
  contactFacilities: {
    url: '/new-covid-19-vaccine-appointment/contact-facility',
  },
  vaFacility: {
    url: '/new-covid-19-vaccine-appointment/choose-facility',
    async next(state, dispatch) {
      const formData = selectCovid19VaccineFormData(state);
      let clinics = selectCovid19VaccineNewBooking(state).clinics?.[
        formData.vaFacility
      ];
      if (!clinics) {
        clinics = await dispatch(
          getClinics({
            facilityId: formData.vaFacility,
            showModal: true,
          }),
        );
      }

      if (!clinics?.length) {
        dispatch(showEligibilityModal());
        return 'vaFacility';
      }

      if (clinics.length === 1) {
        return 'selectDate1';
      }
      return 'clinicChoice';
    },
  },
  clinicChoice: {
    url: '/new-covid-19-vaccine-appointment/choose-clinic',
    next: 'selectDate1',
  },
  selectDate1: {
    url: '/new-covid-19-vaccine-appointment/select-date',
    next: 'secondDosePage',
  },
  secondDosePage: {
    url: '/new-covid-19-vaccine-appointment/second-dose-info',
    next: 'contactInfo',
  },
  contactInfo: {
    url: '/new-covid-19-vaccine-appointment/contact-info',
    next: 'review',
  },
  review: {
    url: '/new-covid-19-vaccine-appointment/review',
    next: '',
  },
};
