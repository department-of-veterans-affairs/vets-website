import PropTypes from 'prop-types';
import React from 'react';

import { SERVICE_REGISTRY } from '../constants';

const listFmt = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
});

const CONTENT = {
  heading: names => `${names} status is unavailable`,
  body: names =>
    `VA.gov is having trouble loading ${names} information at this time. Check back again in an hour.`,
  note: availableNames =>
    `Note: You are still able to review ${availableNames} information.`,
};

function formatServiceNames(services, property) {
  const names = services
    .map(service => SERVICE_REGISTRY[service]?.[property])
    .filter(Boolean);
  return listFmt.format(names);
}

function ServiceUnavailableAlert({ services, headerLevel = 3 }) {
  if (!services?.length) return null;

  const clampedLevel = Math.min(6, Math.max(1, headerLevel));
  const HeadingTag = `h${clampedLevel}`;

  const headingNames = formatServiceNames(services, 'singularTitle'); // "Claim and Appeal"
  const bodyNames = formatServiceNames(services, 'lowercase'); // "claims and appeals"

  // Calculate available services
  const availableServices = Object.keys(SERVICE_REGISTRY).filter(
    service => !services.includes(service),
  );
  const availableNames = formatServiceNames(availableServices, 'lowercase');

  return (
    <va-alert
      class="vads-u-margin-top--1 vads-u-margin-bottom--3"
      status="warning"
    >
      <HeadingTag slot="headline">{CONTENT.heading(headingNames)}</HeadingTag>
      <p className="vads-u-margin-y--0">
        {CONTENT.body(bodyNames)}
        {availableNames && ` ${CONTENT.note(availableNames)}`}
      </p>
    </va-alert>
  );
}

ServiceUnavailableAlert.propTypes = {
  services: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(SERVICE_REGISTRY)))
    .isRequired,
  headerLevel: PropTypes.number,
};

export default ServiceUnavailableAlert;
