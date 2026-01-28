import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  // selectFeatureRecentLocationsFilter,
  selectSystemIds,
} from '../../redux/selectors';
import {
  useGetClinicsQuery,
  useGetFacilitiesQuery,
  useGetLocationSettingsQuery,
} from '../../services/healthcare-service/apiSlice';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
import { captureError } from '../../utils/error';
import {
  recordEligibilityFailure,
  recordItemsRetrieved,
} from '../../utils/events';
import { selectCovid19VaccineNewBooking } from './selectors';

export default function useOpenFacilityPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClinics, setLoadingClinics] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [facilityId, setFacilityId] = useState(null);

  const newBooking = useSelector(selectCovid19VaccineNewBooking);
  // console.log('newBooking', newBooking);
  // const facilityId = newBooking.data.vaFacility;
  const siteIds = useSelector(selectSystemIds);
  // const featureRecentLocationsFilter = useSelector(
  //   selectFeatureRecentLocationsFilter,
  // );

  const {
    data: facilities,
    isError: isErrorFacilities,
    isLoading: isLoadingFacilities,
    isSuccess: isSuccessFacilities,
  } = useGetFacilitiesQuery({ ids: siteIds });
  const {
    data: locationSettings,
    isError: isErrorSettings,
    isLoading: isLoadingSettings,
    isSuccess: isSuccessSettings,
  } = useGetLocationSettingsQuery({ ids: siteIds });
  const {
    // data: clinics,
    isError: isErrorClinics,
    isLoading: isLoadingClinics,
    isSuccess: isSuccessClinics,
  } = useGetClinicsQuery({ locationId: facilityId }, { skip: !facilityId });

  useEffect(
    () => {
      if (isErrorFacilities || isErrorSettings || isErrorClinics) {
        setError(true);
        setLoading(false);
      }

      if (isLoadingFacilities || isLoadingSettings || isLoadingClinics) {
        setLoading(true);
        if (isLoadingClinics) setLoadingClinics(true);
      }

      if (isSuccessFacilities) {
        setFacilityId('983');
      }
      if (isSuccessClinics) {
        setLoadingClinics(false);
      }

      if (isSuccessFacilities && isSuccessSettings) {
        setLoading(false);
        setSuccess(true);

        //   if (featureRecentLocationsFilter) {
        //
        //   } else {
        // const ids = facilities?.map(facility => facility.id) || [];
        // const filteredSettings = locationSettings
        //   ?.filter(setting => {
        //     return ids.some(id => {
        //       if (setting.id === id) {
        //         return setting.services?.some(
        //           service =>
        //             service.id === TYPE_OF_CARE_IDS.COVID_VACCINE_ID &&
        //             service?.direct?.enabled,
        //         );
        //       }
        //       return false;
        //     });
        //   })
        //   .reduce((previous, current) => {
        //     return {
        //       ...previous,
        //       [current.id]: current,
        //     };
        //   }, {});
        const filteredSettings = locationSettings
          .filter(setting =>
            setting.supportsServiceV2(TYPE_OF_CARE_IDS.COVID_VACCINE_ID),
          )
          .reduce((previous, current) => {
            return {
              ...previous,
              [current.id]: current,
            };
          }, {});

        const filteredFacilities = facilities?.filter(
          facility =>
            filteredSettings
              ? Object.keys(filteredSettings).some(key => key === facility.id)
              : false,
        );

        try {
          // const initialState = getState();
          // const newBooking = selectCovid19VaccineNewBooking(initialState);
          // let { facilities } = newBooking;
          // let facilityId = newBooking.data.vaFacility;

          // dispatch({
          //   type: FORM_PAGE_FACILITY_OPEN,
          // });

          // Fetch facilities that support this type of care
          // if (!facilities) {
          //   facilities = await getLocationsByTypeOfCareAndSiteIds({
          //     siteIds,
          //   });
          // }

          recordItemsRetrieved(
            'covid19_available_facilities',
            filteredFacilities?.length,
          );

          // dispatch({
          //   type: FORM_PAGE_FACILITY_OPEN_SUCCEEDED,
          //   facilities: facilities || [],
          //   address: selectVAPResidentialAddress(initialState),
          // });

          // If we have an already selected location or only have a single location
          // fetch eligbility data immediately
          // const supportedFacilities = facilities?.filter(
          //   facility =>
          //     facility.legacyVAR.settings[TYPE_OF_CARE_IDS.COVID_VACCINE_ID]?.direct
          //       .enabled,
          // );
          // const clinicsNeeded = !!facilityId || facilities?.length === 1;

          if (isSuccessFacilities && !facilities.length) {
            recordEligibilityFailure(
              'covid19-supported-facilities',
              TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
            );
          }

          // let tempFacilityId = facilityId;
          // if (clinicsNeeded && !facilityId) {
          //   tempFacilityId = facilities[0].id;
          // }

          // const clinics = newBooking.clinics[tempFacilityId] || null;
          // if (clinicsNeeded && !clinics) {
          // dispatch(getClinics({ facilityId }));
          // }
          setData(filteredFacilities);
        } catch (e) {
          setError(true);
          captureError(e, false, 'covid19 vaccine facility page');
          // dispatch({
          //   type: FORM_PAGE_FACILITY_OPEN_FAILED,
          // });
        }
      }
    },
    [
      error,
      facilities,
      facilityId,
      isErrorClinics,
      isErrorFacilities,
      isErrorSettings,
      isLoadingClinics,
      isLoadingFacilities,
      isLoadingSettings,
      isSuccessClinics,
      isSuccessFacilities,
      isSuccessSettings,
      loading,
      locationSettings,
      newBooking.clinics,
      success,
    ],
  );

  return {
    facilities: data,
    isError: error,
    isLoading: loading,
    isLoadingClinics: loadingClinics,
    isSuccess: success,
  };
}
