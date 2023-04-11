import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getVaccinesList } from '../actions/vaccines';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import PrintHeader from '../components/shared/PrintHeader';
import { getAllVaccinesPdf } from '../api/MrApi';
import { downloadFile } from '../util/helpers';
import { RecordType } from '../util/constants';

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
      <p>
        This is a complete list of vaccines that the VA has on file for you.
      </p>
      <p className="print-only vads-u-margin-bottom--0 max-80">
        Your VA Vaccines list may not be complete. If you have any questions
        about your information, visit the FAQs or contact your VA Health care
        team.
      </p>
      <div className="vads-u-display--flex vads-u-margin-y--3 no-print">
        <button
          className="link-button vads-u-margin-right--3"
          type="button"
          data-testid="print-records-button"
          onClick={window.print}
        >
          <i
            aria-hidden="true"
            className="fas fa-print vads-u-margin-right--1"
          />
          Print page
        </button>
        <button className="link-button" type="button" onClick={download}>
          <i
            aria-hidden="true"
            className="fas fa-download vads-u-margin-right--1"
          />
          Download page
        </button>
      </div>

      {content()}
    </div>
  );
};

export default Vaccines;
