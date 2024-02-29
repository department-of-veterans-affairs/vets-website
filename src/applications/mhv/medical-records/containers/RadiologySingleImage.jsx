import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';
import PrintHeader from '../components/shared/PrintHeader';

const RadiologySingleImage = () => {
  const dispatch = useDispatch();
  const { labId, imageId } = useParams();
  // const labAndTestDetails = useSelector(
  //   state => state.mr.labsAndTests.labsAndTestsDetails,
  // );
  const labAndTestDetails = useMemo(() => {
    return {
      name: 'ANKLE LEFT 3 VIEWS',
      category: 'Radiology',
      orderedBy: 'Beth M. Smith',
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
      images: [
        'image',
        'image',
        'image',
        'image',
        'image',
        'image',
        'image',
        'image',
        'image',
        'image',
      ],
    };
  }, []);

  useEffect(
    () => {
      if (labAndTestDetails?.name) {
        dispatch(
          setBreadcrumbs([
            {
              url: `/my-health/medical-records/labs-and-tests/radiology-images/${labId}`,
              label: `Images: ${labAndTestDetails?.name}`,
            },
          ]),
        );
      }
    },
    [labAndTestDetails, labId, dispatch],
  );

  useEffect(
    () => {
      if (labId) {
        dispatch(getlabsAndTestsDetails(labId));
      }
    },
    [labId, dispatch],
  );

  const content = () => {
    if (labAndTestDetails) {
      return (
        <>
          <PrintHeader />
          <h1>
            Image {imageId} of {labAndTestDetails.images.length}
          </h1>

          <div
            className="vads-u-padding--7 vads-u-background-color--black"
            data-testid="image-div"
          >
            <br className="vads-u-margin--7" />
          </div>

          <div className="vads-u-margin-top--4">
            <button
              type="button"
              className="link-button vads-u-margin-right--4 vads-u-margin-y--0"
            >
              <i
                className="fas fa-download vads-u-margin-right--0p5"
                aria-hidden="true"
              />
              Download JPG
            </button>
            <button type="button" className="link-button  vads-u-margin-y--0">
              <i
                className="fas fa-download vads-u-margin-right--0p5"
                aria-hidden="true"
              />
              Download DICOM
            </button>
          </div>
          {labAndTestDetails.images.length > 1 && (
            <div className="vads-u-margin-top--3 vads-u-display--flex">
              {imageId > 1 && (
                <a
                  type="button"
                  className="secondary-button vads-u-flex--1"
                  href={
                    Number(imageId) > 1
                      ? `/my-health/medical-records/labs-and-tests/radiology-images/${
                          labAndTestDetails.id
                        }/${Number(imageId) - 1}`
                      : `/my-health/medical-records/labs-and-tests/radiology-images/${
                          labAndTestDetails.id
                        }/${labAndTestDetails.images.length}`
                  }
                >
                  <i
                    className="fas fa-angle-double-left vads-u-margin-right--1"
                    aria-hidden="true"
                  />
                  Previous
                </a>
              )}
              {imageId < labAndTestDetails.images.length && (
                <a
                  type="button"
                  className="primary-button vads-u-flex--1 vads-u-margin-right--0"
                  href={
                    Number(imageId) < labAndTestDetails.images.length
                      ? `/my-health/medical-records/labs-and-tests/radiology-images/${
                          labAndTestDetails.id
                        }/${Number(imageId) + 1}`
                      : `/my-health/medical-records/labs-and-tests/radiology-images/${
                          labAndTestDetails.id
                        }/1`
                  }
                >
                  Next
                  <i
                    className="fas fa-angle-double-right vads-u-margin-left--1"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          )}

          <div className="max-80 vads-u-margin-bottom--8">
            <h2>Details</h2>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
              Reason for test
            </h3>
            <p className="vads-u-margin--0">{labAndTestDetails.reason}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
              Clinical history
            </h3>
            <p className="vads-u-margin--0">
              {labAndTestDetails.clinicalHistory}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
              Ordered by
            </h3>
            <p className="vads-u-margin--0">{labAndTestDetails.orderedBy}</p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
              Imaging location
            </h3>
            <p className="vads-u-margin--0">
              {labAndTestDetails.imagingLocation}
            </p>
            <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-margin-top--2">
              Imaging provider
            </h3>
            <p className="vads-u-margin--0">
              {labAndTestDetails.imagingProvider}
            </p>
          </div>
        </>
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

export default RadiologySingleImage;
