import React from 'react';
import { useSelector } from 'react-redux';
import DownloadSeiPdf from './DownloadSeiPdf';
import DownloadMilitaryServicePdf from './DownloadMilitaryServicePdf';
import ShowDownloadAlerts from '../../containers/ShowDownloadAlerts';
import { hasEdipi, hasMhvAccount } from '../../selectors';

const DownloadDataSection = () => {
  const UserHasMhvAccount = useSelector(hasMhvAccount);
  const userHasDoDHistoryPdf = useSelector(hasEdipi);

  if (!UserHasMhvAccount && !userHasDoDHistoryPdf) return <></>;

  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--8">
      <h2 className="vads-u-margin-bottom--0">Download your data</h2>
      <div className="vads-l-row">
        <ShowDownloadAlerts />
        {UserHasMhvAccount && <DownloadSeiPdf />}
        {UserHasMhvAccount &&
          userHasDoDHistoryPdf && <DownloadMilitaryServicePdf />}
      </div>
    </div>
  );
};

export default DownloadDataSection;
