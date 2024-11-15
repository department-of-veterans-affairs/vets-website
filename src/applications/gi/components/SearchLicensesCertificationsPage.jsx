import React from 'react';

import { Route, Switch } from 'react-router-dom';
import LicenseCertificationSearchResults from '../containers/LicenseCertificationSearchResults';
import LicenseCertificationSearch from './LicenseCertificationSearch';

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
