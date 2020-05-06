import React from 'react';
import PropTypes from 'prop-types';
import ContactInformation from '../profile/ContactInformation';
import { formatCurrency, isPresent } from '../../utils/helpers';

class VetTecApprovedProgramsList extends React.Component {
  render() {
    const programs = this.props.institution.programs;

    if (programs && programs.length) {
      const selectedProgram =
        this.props.selectedProgram !== ''
          ? this.props.selectedProgram
          : this.props.preSelectedProgram;
      const programRows = programs.map((program, index) => {
        const programLength =
          isPresent(program.lengthInHours) && program.lengthInHours !== '0'
            ? `${program.lengthInHours} hours`
            : 'TBD';
        const tuition = isPresent(program.tuitionAmount)
          ? formatCurrency(program.tuitionAmount)
          : 'TBD';
        const checked =
          selectedProgram &&
          program.description.toLowerCase() === selectedProgram.toLowerCase();
        return (
          <tr key={index}>
            <td className="vads-u-padding-left--0 vads-l-grid-container">
              <div className="program-description vads-l-row">
                <div className="vads-l-col--2 checked-program">
                  <i
                    className={
                      checked
                        ? 'fas fa-check vads-u-padding-right--0p5 vads-u-color--green'
                        : 'vads-u-padding-right--2p5'
                    }
                  />
                </div>
                <div className="vads-l-col--10 ">
                  {program.description}{' '}
                  {checked ? (
                    <span className="sr-only">Selected program</span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </td>
            <td className="vads-u-padding-y--0 program-length">
              {programLength}
            </td>
            <td className="vads-u-padding-y--0">{tuition}</td>
          </tr>
        );
      });

      return (
        <div className="vads-u-margin-top--2">
          <span>The following training programs are approved for VET TEC:</span>
          <table className="vet-tec-programs-table">
            <colgroup>
              <col className="name-col" />
              <col className="hours-col" />
              <col className="tuition-col" />
            </colgroup>
            <thead>
              <tr>
                <th id="program-name-header">Program name</th>
                <th>Length</th>
                <th>Tuition & Fees</th>
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
  }
}

ContactInformation.propTypes = {
  institution: PropTypes.object,
  preSelectedProgram: PropTypes.string,
  selectedProgram: PropTypes.string,
};

export default VetTecApprovedProgramsList;
