import React, { useState } from 'react';
import LicenseCertificationSearch from './search/LicenseCertificationSearch';
import LicenseCertificationSearchResults from './search/LicenseCertificationSearchResults';

function SearchLicensesCertificationsPage() {
  const [hasFetchedOnce] = useState(false);

  const handleSearch = () => {
    return 'search';
  };

  return (
    <div className="lc-search-page">
      <div className="sidebar-wrapper">
        sidebar wrapper
        {/* sidebar */}
      </div>
      <div className="content-wrapper">
        {hasFetchedOnce ? (
          <LicenseCertificationSearchResults />
        ) : (
          <LicenseCertificationSearch handleSearch={handleSearch} />
        )}
      </div>
    </div>
  );
}

export default SearchLicensesCertificationsPage;
