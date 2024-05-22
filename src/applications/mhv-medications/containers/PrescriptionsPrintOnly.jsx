import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import PrintOnlyPage from './PrintOnlyPage';
import AllergiesPrintOnly from '../components/shared/AllergiesPrintOnly';

const PrescriptionsPrintOnly = ({ list, hasError = false }) => {
  const { search } = useLocation();
  const allergies = useSelector(state => state.rx.allergies.allergiesList);
  const selectedSortOption = useSelector(
    state => state.rx.prescriptions.selectedSortOption,
  );
  const page = useMemo(
    () => {
      const query = new URLSearchParams(search);
      return Number(query.get('page'));
    },
    [search],
  );
  const content = () => {
    return (
      <>
        {page ? (
          <PrintOnlyPage
            title="Medications"
            preface={
              !hasError
                ? 'This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.'
                : "We're sorry. There's a problem with our system. Check back later. If you need help now, call your VA pharmacy. You can find the pharmacy phone number on the prescription label."
            }
            subtitle={!hasError ? 'Medications list' : ''}
          >
            {!hasError && (
              <>
                <MedicationsList
                  rxList={list}
                  pagination={{
                    currentPage: 1,
                    totalEntries: list?.length,
                  }}
                  selectedSortOption={selectedSortOption}
                />
                <AllergiesPrintOnly allergies={allergies} />
              </>
            )}
          </PrintOnlyPage>
        ) : (
          <></>
        )}
      </>
    );
  };

  return <div>{content()}</div>;
};

export default PrescriptionsPrintOnly;

PrescriptionsPrintOnly.propTypes = {
  hasError: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
};
