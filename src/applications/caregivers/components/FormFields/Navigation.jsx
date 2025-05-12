import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import formConfig from '../../config/form';

const Navigation = props => {
  const { facilities, query, goToPath } = props;

  const onNavigationPage = path => {
    return goToPath(`/${path}`);
  };

  const facilityOptions = useMemo(
    () =>
      Object.entries(formConfig.chapters).map(section => (
        <>
          <h2>{section[1].title}</h2>
          {Object.entries(section[1].pages).map(page => (
            <>
              <va-card background>
                <va-link
                  text={page[1].title}
                  onClick={() => onNavigationPage(page[1].path)}
                  href="#"
                />
              </va-card>
              <br />
            </>
          ))}
          <br />
        </>
      )),
    [facilities],
  );

  return (
    <div
      role="radiogroup"
      className="vads-u-margin-top--2"
      aria-labelledby="facility-list-heading"
    >
      <div
        className="vads-u-margin-top--1 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
        id="caregiver_facility_results"
      >
        <strong>“{query}”</strong>
      </div>
      {facilityOptions}
    </div>
  );
};

Navigation.propTypes = {
  error: PropTypes.string,
  facilities: PropTypes.array,
  formContext: PropTypes.shape({
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  query: PropTypes.string,
  value: PropTypes.string,
  goToPath: PropTypes.func,
};

export default Navigation;
