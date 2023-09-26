import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from '../utils/constants';
import { getClinics, showEligibilityModal } from './redux/actions';
import {
  selectCovid19VaccineFormData,
  selectCovid19VaccineNewBooking,
} from './redux/selectors';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';

const flow = {
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

/**
 * Function to get new COVID appointment workflow.
 * The URL displayed in the browser address bar is changed when the feature flag
 * is true.
 *
 * @export
 * @param {boolean} state - New COVID appointment state
 * @returns {object} COVID appointment workflow object
 */
export default function getNewBookingFlow(state) {
  const featureBreadcrumbUrlUpdate = selectFeatureBreadcrumbUrlUpdate(state);

  return {
    ...flow,
    clinicChoice: {
      ...flow.clinicChoice,
      url: featureBreadcrumbUrlUpdate
        ? 'clinic'
        : '/new-covid-19-vaccine-appointment/choose-clinic',
    },
    contactFacilities: {
      ...flow.contactFacilities,
      url: featureBreadcrumbUrlUpdate
        ? 'contact-facility'
        : '/new-covid-19-vaccine-appointment/contact-facility',
    },
    contactInfo: {
      ...flow.contactInfo,
      url: featureBreadcrumbUrlUpdate
        ? 'contact-information'
        : '/new-covid-19-vaccine-appointment/contact-info',
    },
    home: {
      ...flow.home,
      url: featureBreadcrumbUrlUpdate
        ? '/schedule/type-of-care'
        : '/new-appointment',
    },
    planAhead: {
      ...flow.planAhead,
      url: featureBreadcrumbUrlUpdate
        ? './'
        : '/new-covid-19-vaccine-appointment',
    },
    receivedDoseScreener: {
      ...flow.receivedDoseScreener,
      url: featureBreadcrumbUrlUpdate
        ? 'doses-received'
        : '/new-covid-19-vaccine-appointment/confirm-doses-received',
    },
    review: {
      ...flow.review,
      url: featureBreadcrumbUrlUpdate
        ? 'review'
        : '/new-covid-19-vaccine-appointment/review',
    },
    root: {
      url: featureBreadcrumbUrlUpdate
        ? '/my-health/appointments'
        : '/health-care/schedule-view-va-appointments/appointments/',
    },
    secondDosePage: {
      ...flow.secondDosePage,
      url: featureBreadcrumbUrlUpdate
        ? 'second-dose'
        : '/new-covid-19-vaccine-appointment/second-dose-info',
    },
    selectDate1: {
      ...flow.selectDate1,
      url: featureBreadcrumbUrlUpdate
        ? 'date-time'
        : '/new-covid-19-vaccine-appointment/select-date',
    },
    vaFacility: {
      ...flow.vaFacility,
      url: featureBreadcrumbUrlUpdate
        ? 'location'
        : '/new-covid-19-vaccine-appointment/choose-facility',
    },
  };
}
