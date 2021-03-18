import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../utils/constants';
import { getClinics, showEligibilityModal } from './redux/actions';
import {
  selectProjectCheetahFormData,
  selectProjectCheetahNewBooking,
} from './redux/selectors';

export default {
  home: {
    url: '/',
  },
  planAhead: {
    url: '/new-covid-19-vaccine-booking',
    next: 'receivedDoseScreener',
  },
  receivedDoseScreener: {
    url: '/new-covid-19-vaccine-booking/received-dose',
    next(state) {
      const formData = selectProjectCheetahFormData(state);
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
    url: '/new-covid-19-vaccine-booking/contact-facilities',
  },
  vaFacility: {
    url: '/new-covid-19-vaccine-booking/facility',
    async next(state, dispatch) {
      const formData = selectProjectCheetahFormData(state);
      let clinics = selectProjectCheetahNewBooking(state).clinics?.[
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
    url: '/new-covid-19-vaccine-booking/clinic',
    next: 'selectDate1',
  },
  selectDate1: {
    url: '/new-covid-19-vaccine-booking/select-date-1',
    next: 'secondDosePage',
  },
  secondDosePage: {
    url: '/new-covid-19-vaccine-booking/plan-second-dose',
    next: 'contactInfo',
  },
  contactInfo: {
    url: '/new-covid-19-vaccine-booking/contact-info',
    next: 'review',
  },
  review: {
    url: '/new-covid-19-vaccine-booking/review',
    next: '',
  },
};
