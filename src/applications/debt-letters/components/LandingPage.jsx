import React from 'react';
import { Link } from 'react-router';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

const LandingPage = () => (
  <div>
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/debt-letters">Debt Letters</a>
    </Breadcrumbs>
    <Link className="usa-button" to="debt-list">
      View your debt
    </Link>
  </div>
);

export default LandingPage;
