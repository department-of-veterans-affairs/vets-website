import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getVaccinesList } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import { getAllVaccinesPdf } from '../api/MrApi';
import { downloadFile } from '../util/helpers';
import { RecordType } from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';

const Vaccines = () => {
  const dispatch = useDispatch();
  const vaccines = useSelector(state => state.mr.vaccines.vaccinesList);

  useEffect(() => {
    dispatch(getVaccinesList());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            { url: '/my-health/medical-records/', label: 'Dashboard' },
            {
              url: '/my-health/medical-records/health-history',
              label: 'Health history',
            },
          ],
          {
            url: '/my-health/medical-records/health-history/vaccines',
            label: 'VA vaccines',
          },
        ),
      );
    },
    [dispatch],
  );

  const download = () => {
    getAllVaccinesPdf().then(res => downloadFile('vaccines.pdf', res.pdf));
  };

  const content = () => {
    if (vaccines?.length) {
      return <RecordList records={vaccines} type={RecordType.VACCINES} />;
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return (
    <div id="vaccines">
      <PrintHeader />
      <h1 className="page-title">Vaccines</h1>
      <div className="set-width">
        <p>
          This is a complete list of vaccines that the VA has on file for you.
        </p>
        <p className="print-only vads-u-margin-bottom--0 max-80">
          Your VA Vaccines list may not be complete. If you have any questions
          about your information, visit the FAQs or contact your VA Health care
          team.
        </p>
        <PrintDownload list download={download} />

        {content()}
      </div>
    </div>
  );
};

export default Vaccines;
