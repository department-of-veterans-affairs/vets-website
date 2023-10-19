import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  clearLabsAndTestDetails,
  getlabsAndTestsDetails,
} from '../actions/labsAndTests';
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
      dispatch(
        setBreadcrumbs([
          {
            url: '/my-health/medical-records/labs-and-tests',
            label: 'Lab and test results',
          },
        ]),
      );
      return () => {
        dispatch(clearLabsAndTestDetails());
      };
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  if (labAndTestDetails?.type === labTypes.CHEM_HEM) {
    return <ChemHemDetails record={labAndTestDetails} fullState={fullState} />;
  }
  if (labAndTestDetails?.type === labTypes.MICROBIOLOGY) {
    return <MicroDetails record={labAndTestDetails} fullState={fullState} />;
  }
  if (labAndTestDetails?.type === labTypes.PATHOLOGY) {
    return (
      <PathologyDetails record={labAndTestDetails} fullState={fullState} />
    );
  }
  if (labAndTestDetails?.type === labTypes.EKG) {
    return <EkgDetails record={labAndTestDetails} />;
  }
  if (labAndTestDetails?.type === labTypes.RADIOLOGY) {
    return (
      <RadiologyDetails record={labAndTestDetails} fullState={fullState} />
    );
  }
  return (
    <va-loading-indicator
      message="Loading..."
      setFocus
      data-testid="loading-indicator"
      class="loading-indicator"
    />
  );
};

export default LabAndTestDetails;
