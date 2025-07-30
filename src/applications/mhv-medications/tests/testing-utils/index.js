import * as allergiesApiModule from '../../api/allergiesApi';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';

import allergiesList from '../fixtures/allergiesList.json';
import medicationInformation from '../fixtures/medicationInformation.json';
import prescriptionsList from '../fixtures/prescriptionsList.json';
import singlePrescription from '../fixtures/prescriptionsListItem.json';

export const stubAllergiesApi = ({
  sandbox,
  data = allergiesList,
  error = undefined,
  isLoading = false,
  isFetching = false,
}) => {
  return sandbox.stub(allergiesApiModule, 'useGetAllergiesQuery').returns({
    data,
    error,
    isLoading,
    isFetching,
  });
};

export const stubPrescriptionIdApi = ({
  sandbox,
  data = singlePrescription,
  error = undefined,
  isLoading = false,
  isFetching = false,
}) => {
  return sandbox
    .stub(prescriptionsApiModule.getPrescriptionById, 'useQuery')
    .returns({
      data,
      error,
      isLoading,
      isFetching,
    });
};

export const stubPrescriptionsApiCache = ({
  sandbox,
  data = prescriptionsList,
  error = undefined,
  isLoading = false,
  isFetching = false,
}) => {
  return sandbox
    .stub(prescriptionsApiModule.getPrescriptionsList, 'useQueryState')
    .returns({
      data,
      error,
      isLoading,
      isFetching,
    });
};

export const stubPrescriptionsListApi = ({
  sandbox,
  data = {
    prescriptions: prescriptionsList.data,
    meta: prescriptionsList.meta,
    pagination: prescriptionsList.meta.pagination,
  },
  error = undefined,
  isLoading = false,
  isFetching = false,
}) => {
  return sandbox
    .stub(prescriptionsApiModule, 'useGetPrescriptionsListQuery')
    .returns({
      data,
      error,
      isLoading,
      isFetching,
    });
};

export const stubPrescriptionDocumentationQuery = ({
  sandbox,
  data = medicationInformation,
  error = undefined,
  isLoading = false,
  isFetching = false,
}) => {
  return sandbox
    .stub(prescriptionsApiModule, 'useGetPrescriptionDocumentationQuery')
    .returns({
      data,
      error,
      isLoading,
      isFetching,
    });
};

export const stubUsePrefetch = ({ sandbox }) => {
  const prefetchStub = sandbox.spy();
  sandbox.stub(prescriptionsApiModule, 'usePrefetch').returns(prefetchStub);
  return prefetchStub;
};
