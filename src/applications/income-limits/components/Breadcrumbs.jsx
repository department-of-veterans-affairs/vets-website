import React from 'react';

const Breadcrumbs = () => {
  return (
    <va-breadcrumbs class="income-limits-breadcrumbs" label="Breadcrumbs">
      <a href="/" key="home">
        Home
      </a>
      <a href="/health-care" key="health-care">
        Health Care
      </a>
      <a href="/health-care/income-limits" key="income-limits">
        Check income limits
      </a>
    </va-breadcrumbs>
  );
};

export default Breadcrumbs;
