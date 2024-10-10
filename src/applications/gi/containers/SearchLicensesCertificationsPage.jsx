import React, { useState } from 'react';
import LicenseCertificationSearch from './search/LicenseCertificationSearch';
import LicenseCertificationSearchResults from './search/LicenseCertificationSearchResults';

function SearchLicensesCertificationsPage() {
  const [results] = useState(null);

  return (
    <div className="lc-search-page">
      <div className="sidebar-wrapper">
        sidebar wrapper
        {/* sidebar */}
      </div>
      <div className="content-wrapper">
        {results === null ? (
          <LicenseCertificationSearch />
        ) : (
          <LicenseCertificationSearchResults />
        )}
      </div>
    </div>
  );
}

export default SearchLicensesCertificationsPage;
