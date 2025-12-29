import PropTypes from 'prop-types';
import React from 'react';

import { SERVICE_REGISTRY } from '../constants';

const listFmt = new Intl.ListFormat('en', {
  style: 'long',
  type: 'disjunction',
});

function formatServiceNames(services, useSingular) {
  const property = useSingular ? 'singular' : 'plural';
  const names = services
    .map(service => SERVICE_REGISTRY[service]?.[property])
    .filter(Boolean);
  return listFmt.format(names);
}

function ServiceUnavailableAlert({
  headerLevel = 3,
  services,
  useSingular = false,
}) {
  if (!services?.length) return null;

  const HeadingTag = `h${headerLevel}`;

  const names = formatServiceNames(services, useSingular);
  const headingText = useSingular
    ? `We can't access your ${names} right now`
    : `We can't access some of your ${names} right now`;

  return (
    <va-alert
      class="vads-u-margin-top--1 vads-u-margin-bottom--3"
      status="warning"
    >
      <HeadingTag slot="headline">{headingText}</HeadingTag>
      <p className="vads-u-margin-y--0">
        We're sorry. There's a problem with our system. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );
}

ServiceUnavailableAlert.propTypes = {
  services: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(SERVICE_REGISTRY)))
    .isRequired,
  headerLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  useSingular: PropTypes.bool,
};

export default ServiceUnavailableAlert;
