import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import { setData } from 'platform/forms-system/src/js/actions';
import { apiRequest } from 'platform/utilities/api';
import formConfig from '../config/form';
import Breadcrumbs from '../components/Breadcrumbs';
import NeedHelp from '../components/NeedHelp';

export default function App({ location, children }) {
  const formData = useSelector(state => state.form?.data);

  const dispatch = useDispatch();
  // useEffect(
  //   () => {
  //     const targetElement = document.querySelector('.other-role');
  //     console.log('targetElementttttttttt', targetElement);
  //     if (targetElement) {

  //       const { parentElement } = targetElement;
  //       if (parentElement) {
  //         parentElement.classList.add('form-expanding-group-open');
  //       }
  //     }
  //   },
  //   [formData],
  // );
  useEffect(
    () => {
      const fetchInstitutionName = async () => {
        dispatch(
          setData({
            ...formData,
            institutionDetails: {
              ...formData.institutionDetails,
              institutionName: '',
              loader: true,
            },
          }),
        );
        try {
          const response = await apiRequest(
            `/gi/institutions/${formData?.institutionDetails.facilityCode}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: response?.data?.attributes?.name,
                address: {
                  address1: response?.data?.attributes?.address1,
                  address2: response?.data?.attributes?.address2,
                  address3: response?.data?.attributes?.address3,
                  city: response?.data?.attributes?.city,
                  state: response?.data?.attributes?.state,
                  zip: response?.data?.attributes?.zip,
                  country: response?.data?.attributes?.country,
                },
                loader: false,
              },
            }),
          );

          localStorage.setItem(
            'isAccredited',
            JSON.stringify(response?.data?.attributes?.accredited),
          );
        } catch (error) {
          dispatch(
            setData({
              ...formData,
              institutionDetails: {
                ...formData.institutionDetails,
                institutionName: 'not found',
                address: {
                  address1: '',
                  address2: '',
                  address3: '',
                  city: '',
                  state: '',
                  zip: '',
                  country: '',
                },
                loader: false,
              },
            }),
          );
          localStorage.setItem('isAccredited', false);
        }
      };
      if (formData?.institutionDetails?.facilityCode?.length === 8) {
        fetchInstitutionName();
      }
    },
    [formData?.institutionDetails?.facilityCode],
  );

  return (
    <div className="form-22-1919-container row">
      <div className="vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
      <NeedHelp />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};
