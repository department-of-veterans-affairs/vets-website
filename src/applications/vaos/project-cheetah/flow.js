import { getClinics, showEligibilityModal } from './redux/actions';
import {
  selectProjectCheetahFormData,
  selectProjectCheetahNewBooking,
} from './redux/selectors';

export default {
  home: {
    url: '/',
  },
  info: {
    url: '/new-project-cheetah-booking',
    next: 'vaFacility',
  },
  vaFacility: {
    url: '/new-project-cheetah-booking/facility',
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
    url: '/new-project-cheetah-booking/clinic',
    next: 'selectDate1',
  },
  selectDate1: {
    url: '/new-project-cheetah-booking/select-date-1',
    next: 'review',
  },
  review: {
    url: '/new-project-cheetah-booking/review',
    next: '',
  },
};
