import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { mapProgramTypeToName, mapToDashedName } from '../../utils/helpers';

const Programs = ({ programTypes, facilityCode }) => {
  const history = useHistory();

  const handleRouteChange = programType => event => {
    event.preventDefault();
    const dashedName = mapToDashedName(programType)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\//g, '-');

    history.push(`../institution/${facilityCode}/${dashedName}`);
  };

  return (
    <>
      <p>
        The following{' '}
        {programTypes.length === 1 ? 'program is' : 'programs are'} approved for
        VA benefits at this institution. For more information about specific
        programs, search the institution catalog or website.
      </p>
      {programTypes.map((programType, index) => {
        const dashedName = mapToDashedName(programType)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/\//g, '-');

        return (
          <span
            key={index}
            className="program-link-wrapper vads-u-display--flex vads-u-justify-content--space-between"
          >
            <VaLink
              href={`/education/gi-bill-comparison-tool/schools-and-employers/institution/${facilityCode}/${dashedName}`}
              text={`See ${mapProgramTypeToName(programType)} programs`}
              className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--2"
              data-testid="program-link"
              onClick={handleRouteChange(programType)}
              type="secondary"
            />
          </span>
        );
      })}
    </>
  );
};

Programs.propTypes = {
  programTypes: PropTypes.array.isRequired,
  facilityCode: PropTypes.string.isRequired,
};

export default Programs;
