import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import { Actions } from '../util/actionTypes';
import { rxListSortingOptions } from '../util/constants';
import { getPrescriptionSortedList } from '../api/rxApi';
import { getAllergiesList } from '../actions/prescriptions';
import PrintOnlyPage from './PrintOnlyPage';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';

const PrescriptionsPrintOnly = () => {
  const location = useLocation();
  const [fullPrescriptionsList, setFullPrescriptionsList] = React.useState([]);
  const dispatch = useDispatch();
  const allergies = useSelector(state => state.rx.allergies.allergiesList);
  const allergiesError = useSelector(state => state.rx.allergies.error);
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions.selectedSortOption,
  );
  const [currentSortOption, setCurrentSortOption] = React.useState(
    selectedSortOption,
  );
  const [isListLoaded, setIsListLoaded] = React.useState(false);
  const LIST_PAGE_PATTERN = React.useMemo(() => /^\/\d+$/, []);
  React.useEffect(
    () => {
      const getFullList = async () => {
        setIsListLoaded(false);
        await getPrescriptionSortedList(
          rxListSortingOptions[selectedSortOption].API_ENDPOINT,
          true,
        )
          .then(response => {
            setFullPrescriptionsList(
              response.data.map(rx => ({ ...rx.attributes })),
            );
            dispatch({
              type: Actions.Prescriptions.GET_SORTED_LIST,
              response,
            });
            setIsListLoaded(true);
          })
          .catch(() => {
            setIsListLoaded(false);
          });
        dispatch(getAllergiesList());
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
      allergies,
      dispatch,
    ],
  );
  const content = () => {
    return (
      <>
        {LIST_PAGE_PATTERN.test(location.pathname) ? (
          <div className="print-only">
            <PrintOnlyPage
              title="Medications"
              preface={
                isListLoaded
                  ? 'This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.'
                  : "We're sorry. There's a problem with our system. Check back later. If you need help now, call your VA pharmacy. You can find the pharmacy phone number on the prescription label."
              }
              subtitle={isListLoaded ? 'Medications list' : ''}
            >
              {isListLoaded && (
                <>
                  <MedicationsList
                    rxList={fullPrescriptionsList}
                    pagination={{
                      currentPage: 1,
                      totalEntries: fullPrescriptionsList.length,
                    }}
                    selectedSortOption={selectedSortOption}
                  />
                  <AllergiesPrintOnly
                    allergies={allergies}
                    allergiesError={allergiesError}
                  />
                </>
              )}
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
