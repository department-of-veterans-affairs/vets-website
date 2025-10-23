import React from 'react';

export default function Breadcrumbs() {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/contact-us', label: 'Contact us' },
    { href: '/contact-us/virtual-agent', label: 'VA chatbot' },
  ];
  const bcString = JSON.stringify(breadcrumbs);

  return <va-breadcrumbs breadcrumb-list={bcString} label="Breadcrumb" />;
}
