import React from 'react';

const NeedHelpSection = () => {
  return (
    <>
      <h3 className="vads-u-padding-bottom--0p5 vads-u-border-bottom--2px vads-u-border-color--primary">
        Need help?
      </h3>
      <p className="vads-u-margin--0 vads-u-margin-bottom--5">
        If you need help downloading your reports, call us at{' '}
        <va-telephone contact="8773270022" /> (
        <va-telephone contact="711" TTY />
        ). We’re here Monday through Friday, 8:00 a.m to 8:00 p.m ET.
      </p>
    </>
  );
};

export default NeedHelpSection;
