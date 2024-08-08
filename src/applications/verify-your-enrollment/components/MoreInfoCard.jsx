import React from 'react';
import PropType from 'prop-types';
import { useSelector } from 'react-redux';
import PageLink from './PageLink';

const MoreInfoCard = ({
  marginTop,
  linkText,
  relativeURL,
  URL,
  className,
  linkDescription,
}) => {
  const response = useSelector(state => state.personalInfo);
  if (response?.error?.error === 'Forbidden') return null;
  return (
    <div className={`vads-u-margin-top--${marginTop}`}>
      <va-card background>
        <h3 className="vads-u-font-family--serif vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-top--0">
          More information
        </h3>
        <hr className="vads-u-margin-top--0" />
        <PageLink
          linkText={linkText}
          relativeURL={relativeURL}
          URL={URL}
          className={className}
        />
        <p className="vads-u-color--base vads-u-margin-top--0 vads-u-text-align--justify">
          {linkDescription}
        </p>
        <PageLink
          linkText="Manage your VA debt"
          URL="https://www.va.gov/manage-va-debt/"
          className={className}
        />
        <p className="vads-u-color--base vads-u-margin-top--0">
          Check the status of debt related to VA disability compensation,
          non-service-connected pension, or education benefits. You can also
          make payments or request help.
        </p>
      </va-card>
    </div>
  );
};

MoreInfoCard.propTypes = {
  URL: PropType.string,
  className: PropType.string,
  linkDescription: PropType.string,
  linkText: PropType.string,
  marginTop: PropType.string,
  relativeURL: PropType.string,
};

export default MoreInfoCard;
