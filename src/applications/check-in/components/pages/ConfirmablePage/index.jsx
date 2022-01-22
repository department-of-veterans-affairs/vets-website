import React from 'react';
import DemographicItem from '../../DemographicItem';
import PropTypes from 'prop-types';

const ConfirmablePage = ({
  header,
  subtitle,
  dataFields = [],
  data = {},
  yesAction = () => {},
  noAction = () => {},
  isLoading = false,
  LoadingMessage = () => <va-loading-indicator message="Loading..." />,
  Footer,
  isPreCheckIn,
}) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--6 vads-u-padding-top--2 confirmable-page">
      <h1 data-testid="header">{header}</h1>
      {subtitle && (
        <p data-testid="subtitle" className="vads-u-font-family--serif">
          {subtitle}
        </p>
      )}
      <div className="vads-u-border-color--primary vads-u-border-left--5px vads-u-margin-left--0p5 vads-u-padding-left--2">
        <dl data-testid="demographics-fields">
          {dataFields.map(field => (
            <React.Fragment key={field.key}>
              <dt className="vads-u-font-weight--bold">{field.title}</dt>
              <dd>
                {field.key in data && data[field.key] ? (
                  <DemographicItem demographic={data[field.key]} />
                ) : (
                  'Not available'
                )}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      {isLoading ? (
        <>
          <LoadingMessage />
        </>
      ) : (
        <>
          <button
            onClick={yesAction}
            className={'usa-button-secondary usa-button-big'}
            data-testid="yes-button"
          >
            Yes
          </button>
          <button
            onClick={noAction}
            className="usa-button-secondary vads-u-margin-top--2 usa-button-big"
            data-testid="no-button"
          >
            No
          </button>
        </>
      )}
      {Footer && <Footer isPreCheckIn={isPreCheckIn} />}
    </div>
  );
};
ConfirmablePage.propTypes = {
  header: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  dataFields: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  data: PropTypes.object.isRequired,
  yesAction: PropTypes.func.isRequired,
  noAction: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  LoadingMessage: PropTypes.func,
  Footer: PropTypes.func,
  isPreCheckIn: PropTypes.bool,
};
export default ConfirmablePage;
