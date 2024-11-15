import React from 'react';

import { Route, Switch } from 'react-router-dom';
import LicenseCertificationSearchResults from '../containers/LicenseCertificationSearchResults';
import LicenseCertificationSearch from './LicenseCertificationSearch';

export default function SearchLicensesCertificationsPage() {
  return (
    <div className="lc-search-page">
      <div className="content-wrapper">
        <Switch>
          <Route exact path="/lc-search/results">
            <LicenseCertificationSearchResults />
          </Route>
          <Route exact path="/lc-search">
            <LicenseCertificationSearch />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
