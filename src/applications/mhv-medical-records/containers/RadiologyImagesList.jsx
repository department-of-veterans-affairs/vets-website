import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';

import ImageGallery from '../components/shared/ImageGallery';
import { fetchImageList, fetchImageRequestStatus } from '../actions/images';

const RadiologyImagesList = () => {
  const dispatch = useDispatch();

  const { labId } = useParams();
  // const labAndTestDetails = useSelector(
  //   state => state.mr.labsAndTests.labsAndTestsDetails,
  // );
  const radiologyDetails = useSelector(
    state => state.mr.labsAndTests.labsAndTestsDetails,
  );

  const imageList = useSelector(state => state.mr.images.imageList);

  const labAndTestDetails = {
    name: 'ANKLE LEFT 3 VIEWS',
    category: 'Radiology',
    orderedBy: 'DOE, JANE A',
    reason: 'Injury',
    clinicalHistory: 'Information',
    imagingProvider: 'John J. Lydon',
    id: 122,
    date: 'April 13, 2022, 5:25 a.m. MDT',
    imagingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    reactions: ['Just this one'],
    results:
      'This exam was performed at 673RD MED GRP, Elmendorf AFB. The report is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nImpression:\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nPrimary Diagnostic Code: BI-RADS CATEGORY 6 (Known Biopsy Proven Malignancy)\nSecondary Diagnostic Codes:\nBI-RADS CATEGORY 3 (Probably Benign)\nVERIFIED BY:\n/\n**********************\n*ELECTRONICALLY FILED*\n**********************\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nThis exam was performed at 673RD MED GRP, Elmendorf AFB. The\nreport is available in VistaWeb and Vista Imaging.\nIf you are unable to find images or a report please contact your\nlocal Imaging Coordinator.\nImpression:\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nExam performed and interpreted at 673rd MDG Elmendorf AFB, report\navailable in CPRS using VistaWeb or Remote Data.\nPrimary Diagnostic Code: BI-RADS CATEGORY 6 (Known Biopsy Proven Malignancy)\nSecondary Diagnostic Codes:\nBI-RADS CATEGORY 3 (Probably Benign)\nVERIFIED BY:\n/\n**********************\n*ELECTRONICALLY FILED*\n**********************',
  };

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  useEffect(
    () => {
      // dispatch(fetchImageList('453-2487450'));
      if (radiologyDetails) {
        dispatch(fetchImageList(radiologyDetails.studyId));
      }
    },
    [dispatch, radiologyDetails],
  );

  useEffect(
    () => {
      dispatch(fetchImageRequestStatus());
    },
    [dispatch],
  );

  const content = () => {
    if (radiologyDetails) {
      return (
        <ImageGallery
          record={labAndTestDetails}
          imageList={imageList}
          study={radiologyDetails.studyId}
          imageCount={6}
          detailsType="labs and tests"
          id={labId}
          print={false}
        />
      );
    }
    return <></>;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      {content()}
    </div>
  );
};

export default RadiologyImagesList;
