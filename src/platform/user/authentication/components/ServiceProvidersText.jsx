import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { loginGov } from 'platform/user/authentication/selectors';

const initialCSPState = ['ID.me', 'DS Logon', 'My HealtheVet'];

const FormatCSP = ({ isBold, or, comma, last, csp }) => {
  let punctuatedCSP = csp;

  if (comma) punctuatedCSP = `${punctuatedCSP},`;
  if (or) punctuatedCSP = `or ${punctuatedCSP}`;
  if (!last) punctuatedCSP = `${punctuatedCSP} `;

  return isBold ? <strong>{`${punctuatedCSP} `}</strong> : punctuatedCSP;
};

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

  return serviceProviders.map((csp, i) => {
    const totalProviders = serviceProviders.length;
    const last = i === totalProviders - 1;
    const comma = !last && totalProviders > 2;
    const or = totalProviders >= 2 && last;

    return (
      <FormatCSP
        isBold={isBold}
        or={or}
        comma={comma}
        last={last}
        key={csp}
        csp={csp}
      />
    );
  });
});

export default ServiceProviders;
