import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

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

Heading.propTypes = {
  text: PropTypes.string.isRequired,
  level: PropTypes.number,
};

const SubHeading = ({
  text,
  level,
  editLink = null,
  id = null,
  name = null,
}) => {
  const H = `h${level || 3}`;
  return (
    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-border-bottom--1px vads-u-margin-bottom--2">
      <H className="vads-u-margin--0" id={id} tabIndex="-1" name={name}>
        {text}
      </H>
      {editLink && (
        <Link to={editLink} className="vads-u-text-decoration--none">
          Edit <span className="sr-only">{text?.toLowerCase?.()}</span>
        </Link>
      )}
    </div>
  );
};

SubHeading.propTypes = {
  text: PropTypes.string.isRequired,
  editLink: PropTypes.string,
  id: PropTypes.string,
  level: PropTypes.number,
  name: PropTypes.string,
};

const InfoBlock = ({ label, value, placeholder }) => (
  <div className="vads-u-margin-bottom--2">
    <dt className="vads-u-font-size--sm vads-u-color--gray-medium">{label}</dt>
    <dd className="vads-u-margin-left--0">
      {valueOrPlaceholder(value, placeholder)}
    </dd>
  </div>
);

InfoBlock.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export const InfoSection = ({ title, children, titleLevel }) => (
  <section className="vads-u-margin-bottom--4">
    {title && <Heading text={title} level={titleLevel} tabIndex="-1" />}
    <div className="vads-u-margin--0">{children}</div>
  </section>
);

InfoSection.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  titleLevel: PropTypes.number,
};

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

ServicePeriod.propTypes = {
  applyToBenefit: PropTypes.string,
  branchOfService: PropTypes.string,
  endDate: PropTypes.string,
  startDate: PropTypes.string,
  typeOfService: PropTypes.string,
};

InfoSection.Heading = Heading;
InfoSection.SubHeading = SubHeading;
InfoSection.InfoBlock = InfoBlock;
InfoSection.ServicePeriod = ServicePeriod;

export default InfoSection;
