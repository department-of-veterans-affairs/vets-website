import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const MedicalRecordsCard = ({ href }) => {
  const slug = 'mhv-c-card-medical-records';
  return (
    <div
      className={classnames(
        'vads-u-height--full',
        'vads-u-padding-x--5',
        'vads-u-padding-top--4',
        'vads-u-padding-bottom--2',
        'vads-u-background-color--gray-lightest',
      )}
    >
      <div className="vads-u-display--flex vads-u-align-items--center">
        <div className="vads-u-flex--auto vads-u-margin-right--1p5 small-screen:vads-u-margin-top--0p5">
          <div
            aria-hidden="true"
            className="fas fa-file-medical vads-u-font-size--h2"
          />
        </div>
        <div className="vads-u-flex--fill">
          <h2 className="vads-u-margin--0" id={slug}>
            Medical records
          </h2>
        </div>
        <div className="vads-u-flex--auto">
          <span
            className={classnames(
              'usa-label',
              'vads-u-background-color--hub-burials',
              'vads-u-display--none',
              'small-desktop-screen:vads-u-display--block',
            )}
          >
            Coming soon
          </span>
        </div>
      </div>
      <p>
        <span
          className={classnames(
            'usa-label',
            'vads-u-background-color--hub-burials',
            'vads-u-display--inline-block',
            'small-desktop-screen:vads-u-display--none',
          )}
        >
          Coming soon
        </span>
      </p>
      <p
        className={classnames(
          'vads-u-padding-left--0',
          'vads-u-margin-top--2',
          'vads-u-margin-bottom--0',
        )}
      >
        The new version of this tool isn’t ready yet. For now, you can get your
        medical records in the previous version of My HealtheVet.
      </p>
      <p>
        <a href={href}>
          Download your medical records on the previous version of My HealtheVet
        </a>
      </p>
    </div>
  );
};

MedicalRecordsCard.propTypes = {
  href: PropTypes.string,
};

export default MedicalRecordsCard;
