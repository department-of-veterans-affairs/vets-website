import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import NeedHelp from '../components/shared/NeedHelp';
import ApiErrorNotification from '../components/shared/ApiErrorNotification';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { useFetchMedicationHistory } from '../hooks/MedicationHistory/useFetchMedicationHistory';
import { pageType } from '../util/dataDogConstants';
import { rxListSortingOptions } from '../util/constants';
import { selectSortOption } from '../selectors/selectPreferences';
import { setSortOption } from '../redux/preferencesSlice';
import EmptyPrescriptionContent from '../components/MedicationsList/EmptyPrescriptionContent';
import { useFocusManagement } from '../hooks/MedicationsList/useFocusManagement';

const MedicationHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedSortOption = useSelector(selectSortOption);

  const {
    prescriptionsData,
    prescriptionsApiError,
    isLoading,
    setQueryParams,
  } = useFetchMedicationHistory();

  const { pagination, meta = {} } = prescriptionsData || {};
  const filteredList = useMemo(() => prescriptionsData?.prescriptions || [], [
    prescriptionsData?.prescriptions,
  ]);
  const { filterCount } = meta;

  const noFilterMatches =
    filteredList?.length === 0 &&
    filterCount &&
    Object.values(filterCount).some(value => value !== 0);

  const [loadingMessage, setLoadingMessage] = useState(
    'Loading medications...',
  );

  const updateSort = (_filterOption, newSortOption) => {
    if (newSortOption && newSortOption !== selectedSortOption) {
      setLoadingMessage('Sorting your medications...');
      setQueryParams(prev => ({
        ...prev,
        sortEndpoint: rxListSortingOptions[newSortOption].API_ENDPOINT,
        page: 1,
      }));
      dispatch(setSortOption(newSortOption));
      navigate('/history', { replace: true });
    }
  };

  useFocusManagement({
    isLoading,
    filteredList,
    noFilterMatches,
    showingFocusedAlert: false,
  });

  // Medications exist and should be displayed
  const hasMedications = filteredList?.length > 0;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="vads-u-padding-y--9">
          <va-loading-indicator
            message={loadingMessage}
            setFocus
            data-testid="loading-indicator"
          />
        </div>
      );
    }
    if (prescriptionsApiError) {
      return <ApiErrorNotification errorType="access" content="medications" />;
    }
    if (!hasMedications) {
      return <EmptyPrescriptionContent />;
    }
    return (
      <>
        <MedicationsListSort
          sortRxList={updateSort}
          shouldShowSelect={!isLoading}
        />
        {!isLoading &&
          pagination && (
            <MedicationsList
              pagination={pagination}
              rxList={filteredList}
              selectedSortOption={selectedSortOption}
              updateLoadingStatus={setLoadingMessage}
            />
          )}
      </>
    );
  };

  useEffect(() => {
    focusElement(document.querySelector('h1'));
  }, []);

  return (
    <div>
      <h1 data-testid="medication-history-heading">Medication history</h1>
      {/* TODO verify link destination */}
      <Link to="/in-progress">Go to your in-progress medications</Link>
      <span className="vads-u-margin-x--1">|</span>
      <Link to="/refill">Refill medications 2</Link>
      {renderContent()}
      <NeedHelp page={pageType.HISTORY} headingLevel={2} />
    </div>
  );
};

export default MedicationHistory;
