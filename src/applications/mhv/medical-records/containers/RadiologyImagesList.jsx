import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chunk } from 'lodash';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import { getlabsAndTestsDetails } from '../actions/labsAndTests';
import PrintDownload from '../components/shared/PrintDownload';
import PrintHeader from '../components/shared/PrintHeader';

const RadiologyImagesList = () => {
  const dispatch = useDispatch();
  const { labId } = useParams();
  const [currentImageCount, setCurrentImageCount] = useState(5);
  // const labAndTestDetails = useSelector(
  //   state => state.mr.labsAndTests.labsAndTestsDetails,
  // );
  const labAndTestDetails = {
    name: 'ANKLE LEFT 3 VIEWS',
    category: 'Radiology',
    orderedBy: 'Beth M. Smith',
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    reason: 'Injury',
    clinicalHistory: 'Information',
    imagingProvider: 'John J. Lydon',
    id: 122,
    date: '2022-04-13T17:42:46.000Z',
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

  const formattedDate = formatDateLong(labAndTestDetails?.date);

  const download = () => {};

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
              {
                url: `/my-health/medical-records/labs-and-tests/${labId}`,
                label: labAndTestDetails?.name,
              },
            ],
            {
              url: `/my-health/medical-records/labs-and-tests/radiology-images/${labId}`,
              label: `Images: ${labAndTestDetails?.name}`,
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

  const content = () => {
    if (labAndTestDetails) {
      return (
        <>
          <PrintHeader />
          <h1 className="vads-u-margin-bottom--0">
            Images: {labAndTestDetails.name}
          </h1>
          <div className="time-header">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans">
              Date:{' '}
            </h2>
            <p>{formattedDate}</p>
          </div>

          <div className="no-print">
            <PrintDownload download={download} />
            <va-additional-info trigger="What to know about downloading records">
              <ul>
                <li>
                  <strong>If you’re on a public or shared computer,</strong>{' '}
                  print your records instead of downloading. Downloading will
                  save a copy of your records to the public computer.
                </li>
                <li>
                  <strong>If you use assistive technology,</strong> a Text file
                  (.txt) may work better for technology such as screen reader,
                  screen enlargers, or Braille displays.
                </li>
              </ul>
            </va-additional-info>
          </div>

          <div className="vads-u-padding--0 vads-u-border-top--1px vads-u-border-color--gray-lighter vads-l-grid-container vads-l-row vads-u-margin-bottom--2">
            {chunk(labAndTestDetails.images, currentImageCount)[0].map(
              (image, idx) => (
                <div
                  className="image-div vads-l-col--4"
                  data-testid="image-div"
                  key={idx}
                >
                  <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--h3">
                    Image {idx + 1} of {labAndTestDetails.images.length}
                  </h2>
                  <div
                    className="vads-u-padding-x--3 vads-u-padding-y--7 vads-u-background-color--black vads-u-margin-y--0p5"
                    aria-label={image}
                  >
                    <br className="vads-u-margin-y--4" />
                  </div>
                  <va-link
                    className="vads-u-margin-top--1"
                    active
                    href={`/my-health/medical-records/labs-and-tests/radiology-images/${labId}/${idx +
                      1}`}
                    text="Review full image"
                  />
                </div>
              ),
            )}
          </div>
          {currentImageCount < labAndTestDetails.images.length && (
            <button
              className="load-more-button"
              type="button"
              onClick={() => setCurrentImageCount(currentImageCount + 5)}
            >
              Load 5 more images
            </button>
          )}
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

export default RadiologyImagesList;
