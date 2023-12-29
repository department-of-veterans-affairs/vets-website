import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import { rxListSortingOptions } from '../util/constants';
import { getPrescriptionSortedList } from '../api/rxApi';
import PrintOnlyPage from './PrintOnlyPage';

const PrescriptionsPrintOnly = () => {
  const location = useLocation();
  const [fullPrescriptionsList, setFullPrescriptionsList] = React.useState([]);
  // const allergies = useSelector(state => state.rx.allergies); TODO:// Use later
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions.selectedSortOption,
  );
  const [currentSortOption, setCurrentSortOption] = React.useState(
    selectedSortOption,
  );
  const LIST_PAGE_PATTERN = React.useMemo(() => /^\/\d+$/, []);
  React.useEffect(
    () => {
      const getFullList = async () => {
        await getPrescriptionSortedList(
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
          true,
        ).then(response =>
          setFullPrescriptionsList(
            response.data.map(rx => ({ ...rx.attributes })),
          ),
        );
        // if (!allergies) dispatch(getAllergiesList()); TODO:// Use later
      };
      if (
        LIST_PAGE_PATTERN.test(location.pathname) &&
        (fullPrescriptionsList.length === 0 ||
          currentSortOption !== selectedSortOption)
      ) {
        getFullList();
        setCurrentSortOption(selectedSortOption);
      }
    },
    [
      location.pathname,
      selectedSortOption,
      fullPrescriptionsList.length,
      LIST_PAGE_PATTERN,
      currentSortOption,
    ],
  );
  const content = () => {
    return (
      <>
        {LIST_PAGE_PATTERN.test(location.pathname) ? (
          <div className="print-only print-only-rx-full-list-page">
            <PrintOnlyPage
              title="Medications"
              preface="This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records."
              subtitle="Medications List"
            >
              <MedicationsList
                rxList={fullPrescriptionsList}
                pagination={{
                  currentPage: 1,
                  totalEntries: fullPrescriptionsList.length,
                }}
                selectedSortOption={selectedSortOption}
              />
            </PrintOnlyPage>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  };

  return <div>{content()}</div>;
};

export default PrescriptionsPrintOnly;
