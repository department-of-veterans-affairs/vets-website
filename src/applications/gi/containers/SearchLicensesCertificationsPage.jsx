import React from 'react';

import { Route, Switch } from 'react-router-dom';

import LicenseCertificationSearch from './search/LicenseCertificationSearch';
import LicenseCertificationSearchResults from './search/LicenseCertificationSearchResults';

export default function SearchLicensesCertificationsPage() {
  return (
    <div className="lc-search-page">
      <div className="content-wrapper">
        <Switch>
          <Route
            exact
            path="/lc-search/results"
            render={({ match }) => (
              <LicenseCertificationSearchResults match={match} />
            )}
          />
          <Route
            exact
            path="/lc-search"
            render={({ match }) => <LicenseCertificationSearch match={match} />}
          />
        </Switch>
      </div>
    </div>
  );
}
