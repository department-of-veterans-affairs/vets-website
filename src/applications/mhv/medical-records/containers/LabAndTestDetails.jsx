import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLabAndTest } from '../actions/labsAndTests';
import EkgDetails from '../components/LabsAndTests/EkgDetails';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PathologyDetails from '../components/LabsAndTests/PathologyDetails';

const LabAndTestDetails = () => {
  const dispatch = useDispatch();
  const labAndTestDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );
  const fullState = useSelector(state => state);
  const { labId } = useParams();

  useEffect(
    () => {
      if (labAndTestDetails?.name) {
        dispatch(
          setBreadcrumbs(
            [
              { url: '/my-health/medical-records/', label: 'Dashboard' },
              {
                url: '/my-health/medical-records/labs-and-tests',
                label: 'Lab and test results',
              },
            ],
            {
              url: `/my-health/medical-records/labs-and-tests/${labId}`,
              label: labAndTestDetails?.name,
            },
          ),
        );
      }
    },
    [labAndTestDetails, dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getLabAndTest(labId));
      }
    },
    [labId, dispatch],
  );

  if (labAndTestDetails?.name) {
    switch (labAndTestDetails?.category.toLowerCase()) {
      case 'chemistry and hematology':
        return <p>chem and hem</p>;
      case 'radiology':
        return <p>radiology</p>;
      default:
        if (labAndTestDetails?.name.toLowerCase().includes('pathology')) {
          return (
            <PathologyDetails
              results={labAndTestDetails}
              fullState={fullState}
            />
          );
        }
        switch (labAndTestDetails?.name.toLowerCase()) {
          case 'electrocardiogram (ekg)':
            return <EkgDetails results={labAndTestDetails} />;
          case 'Microbiology':
            return <p>Microbiology</p>;
          default:
            return <p>something else</p>;
        }
    }
  } else {
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  }
};

export default LabAndTestDetails;
