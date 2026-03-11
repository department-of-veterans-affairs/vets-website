import React from 'react';
import { useSelector } from 'react-redux';
import DownloadSeiPdf from './DownloadSeiPdf';
import DownloadMilitaryServicePdf from './DownloadMilitaryServicePdf';
import ShowDownloadAlerts from '../../containers/ShowDownloadAlerts';
import { hasEdipi, hasMhvAccount } from '../../selectors';

const DownloadDataSection = () => {
  const userHasMhvAccount = useSelector(hasMhvAccount);
  const userHasEdipi = useSelector(hasEdipi);

  if (!userHasMhvAccount) return <></>;

  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--8">
      <h2 className="vads-u-margin-bottom--0">Download your data</h2>
      <div className="vads-l-row">
        <ShowDownloadAlerts />
        {userHasMhvAccount && <DownloadSeiPdf />}
        {userHasMhvAccount && userHasEdipi && <DownloadMilitaryServicePdf />}
      </div>
    </div>
  );
};

export default DownloadDataSection;
