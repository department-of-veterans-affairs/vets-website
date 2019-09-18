import React from 'react';
import environment from 'platform/utilities/environment';
import PropTypes from 'prop-types';
import VetTecContactInformation from './VetTecContactInformation';

export const VetTecApprovedPrograms = ({ institution }) => {
  const programs = institution.programs;
  // prod flag for CT 116 story 19614
  if (!environment.isProduction() && programs && programs.length) {
    const programRows = programs.map((program, index) => (
      <tr key={index}>
        <td>{program.description}</td>
        <td>{program.length}</td>
      </tr>
    ));

    return (
      <div>
        <p>Select a program below to view your estimated benefits.</p>
        <table className="vet-tec-programs-table">
          <thead>
            <tr>
              <th>Program name</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>{programRows}</tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      <p>
        Program data will be available for this provider soon.{' '}
        <a
          href={
            '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about VET TEC programs
        </a>
      </p>
    </div>
  );
};

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
};

export default VetTecApprovedPrograms;
