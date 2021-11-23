import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginGov } from 'platform/user/authentication/selectors';

const initialCSPState = ['ID.me', 'DS Logon', 'My HealtheVet'];

const ServiceProviders = React.memo(({ isBold }) => {
  const [serviceProviders, setCSPs] = useState(initialCSPState);
  const loginGovEnabled = useSelector(state => loginGov(state));

  useEffect(
    () => {
      if (loginGovEnabled) {
        setCSPs(['Login.gov', ...initialCSPState]);
      }
    },
    [loginGovEnabled],
  );

  const splitItem = serviceProviders.length - 1;
  const [startingCSPs, lastCSP] = [
    [...serviceProviders.slice(0, splitItem)],
    [...serviceProviders.slice(splitItem, serviceProviders.length)],
  ];

  if (serviceProviders.length === 2) {
    return (
      <>
        {isBold ? <strong>{startingCSPs[0]}</strong> : <>{startingCSPs[0]}</>}{' '}
        and {isBold ? <strong>{lastCSP[0]}</strong> : <>{lastCSP[0]}</>}
      </>
    );
  }

  return (
    <>
      {isBold
        ? startingCSPs.map(csp => (
            <React.Fragment key={csp}>
              <strong>{csp}</strong>,{' '}
            </React.Fragment>
          ))
        : startingCSPs.map(csp => (
            <React.Fragment key={csp}>{csp}, </React.Fragment>
          ))}
      {isBold
        ? lastCSP.map(csp => (
            <React.Fragment key={csp}>
              and <strong>{csp}</strong>.
            </React.Fragment>
          ))
        : lastCSP.map(csp => (
            <React.Fragment key={csp}>and {csp}.</React.Fragment>
          ))}
    </>
  );
});

export default ServiceProviders;
