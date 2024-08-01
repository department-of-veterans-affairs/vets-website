import React from 'react';

export const Breadcrumbs = () => {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    {
      href: '/supporting-forms-for-claims',
      label: 'Supporting forms for VA claims',
    },
    {
      href:
        '/supporting-forms-for-claims/statement-to-support-claim-form-21-4138',
      label: 'Submit a statement to support a claim',
    },
  ];
  const bcString = JSON.stringify(breadcrumbs);
  return (
    <va-breadcrumbs
      className="breadcrumbs-container"
      breadcrumb-list={bcString}
      label="Breadcrumb"
      home-veterans-affairs={false}
    />
  );
};

export const CustomTopContent = ({ currentLocation }) => {
  if (
    currentLocation?.pathname.includes('confirmation') ||
    currentLocation?.pathname.includes('introduction')
  ) {
    return <>{Breadcrumbs}</>;
  }
  return null;
};
