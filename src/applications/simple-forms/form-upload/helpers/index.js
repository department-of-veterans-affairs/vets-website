export const getBreadcrumbList = formNumber => [
  { href: '/', label: 'VA.gov home' },
  {
    href: `/find-forms/about-form-${formNumber}`,
    label: `About VA Form ${formNumber}`,
    isRouterLink: true,
  },
  {
    href: `/form-upload/${formNumber}`,
    label: `Upload VA Form ${formNumber}`,
    isRouterLink: true,
  },
];

export const getFormNumber = location => {
  const path = location.pathname;
  const regex = /\/(\d{2}-\d{4})/;
  return path.match(regex)[1];
};

export const getFormUploadContent = formNumber => {
  if (formNumber === '21-0779') {
    return 'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';
  }

  return '';
};

export const handleRouteChange = ({ detail }, history) => {
  const { href } = detail;
  history.push(href);
};
