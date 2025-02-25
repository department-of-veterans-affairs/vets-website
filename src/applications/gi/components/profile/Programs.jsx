import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { mapProgramTypeToName, mapToDashedName } from '../../utils/helpers';

const Programs = ({ programTypes, facilityCode }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const giCtCollab = useToggleValue(TOGGLE_NAMES.giCtCollab);

  return (
    <>
      <p>
        The following{' '}
        {programTypes.length === 1 ? 'program is' : 'programs are'} approved by
        the VA at this institution.
      </p>
      {programTypes.map((programType, index) => (
        <span
          key={index}
          className="program-link-wrapper vads-u-display--flex vads-u-justify-content--space-between"
        >
          <Link
            to={{
              pathname: `${
                giCtCollab ? '/schools-and-employers' : ''
              }/institution/${facilityCode}/${mapToDashedName(programType)
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/\//g, '-')}`,
            }}
            className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--2"
            data-testid="program-link"
          >
            See {mapProgramTypeToName(programType)} programs
          </Link>
        </span>
      ))}
    </>
  );
};

Programs.propTypes = {
  programTypes: PropTypes.array.isRequired,
  facilityCode: PropTypes.string.isRequired,
};

export default Programs;
