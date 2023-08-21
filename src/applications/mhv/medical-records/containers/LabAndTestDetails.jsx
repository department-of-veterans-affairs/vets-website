import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';
import EkgDetails from '../components/LabsAndTests/EkgDetails';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import RadiologyDetails from '../components/LabsAndTests/RadiologyDetails';
import MicroDetails from '../components/LabsAndTests/MicroDetails';
import PathologyDetails from '../components/LabsAndTests/PathologyDetails';
import ChemHemDetails from '../components/LabsAndTests/ChemHemDetails';
import { labTypes } from '../util/constants';

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
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  if (labAndTestDetails?.name) {
    switch (labAndTestDetails.type) {
      case labTypes.CHEM_HEM:
        return (
          <ChemHemDetails record={labAndTestDetails} fullState={fullState} />
        );
      case labTypes.MICROBIOLOGY:
        return (
          <MicroDetails record={labAndTestDetails} fullState={fullState} />
        );
      case labTypes.PATHOLOGY:
        return (
          <PathologyDetails record={labAndTestDetails} fullState={fullState} />
        );
      case labTypes.EKG:
        return <EkgDetails record={labAndTestDetails} />;
      case labTypes.RADIOLOGY:
        return (
          <RadiologyDetails record={labAndTestDetails} fullState={fullState} />
        );
      default:
        return <p>something else</p>;
    }
  } else {
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
        class="loading-indicator"
      />
    );
  }
};

export default LabAndTestDetails;
