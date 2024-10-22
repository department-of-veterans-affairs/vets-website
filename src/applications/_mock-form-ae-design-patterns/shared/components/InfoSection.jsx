import React from 'react';
import { Link } from 'react-router';

const DEFAULT_PLACEHOLDER = 'Not provided';

const valueOrPlaceholder = (value, placeholder = DEFAULT_PLACEHOLDER) =>
  value || placeholder;

const Heading = ({ text, level }) => {
  const H = `h${level || 2}`;
  return (
    <H className="vads-u-margin-top--0 vads-u-border-bottom--4px vads-u-margin-bottom--2 vads-u-padding--0p5">
      {text}
    </H>
  );
};

const SubHeading = ({ text, level, editLink = null, id = null }) => {
  const H = `h${level || 3}`;
  return (
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-border-bottom--1px vads-u-margin-bottom--2">
      <H className="vads-u-margin--0" id={id}>
        {text}
      </H>
      {editLink && (
        <Link
          to={editLink}
          className="vads-u-text-decoration--none"
          text="Edit"
        >
          Edit
        </Link>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value, placeholder }) => (
  <div className="vads-u-margin-bottom--2">
    <dt className="vads-u-font-size--sm vads-u-color--gray-medium">{label}</dt>
    <dd className="vads-u-margin-left--0">
      {valueOrPlaceholder(value, placeholder)}
    </dd>
  </div>
);

export const InfoSection = ({ title, children, titleLevel }) => (
  <section className="vads-u-margin-bottom--4">
    {title && <Heading text={title} level={titleLevel} />}
    <dl className="vads-u-margin--0">{children}</dl>
  </section>
);

const ServicePeriod = ({
  branchOfService,
  typeOfService,
  startDate,
  endDate,
  applyToBenefit,
}) => (
  <div className="vads-u-margin-bottom--4">
    <SubHeading text="Service period" level={4} editLink="#" />
    <InfoBlock label="Branch of service" value={branchOfService} />
    <InfoBlock label="Type of service" value={typeOfService} />
    <InfoBlock label="Service start date" value={startDate} />
    <InfoBlock label="Service end date" value={endDate} />
    <InfoBlock
      label="Apply this service period to the benefit I'm applying for"
      value={applyToBenefit}
    />
  </div>
);

InfoSection.Heading = Heading;
InfoSection.SubHeading = SubHeading;
InfoSection.InfoBlock = InfoBlock;
InfoSection.ServicePeriod = ServicePeriod;

export default InfoSection;
