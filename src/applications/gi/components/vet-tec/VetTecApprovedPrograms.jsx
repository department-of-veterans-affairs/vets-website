import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import VetTecContactInformation from './VetTecContactInformation';
import { calculatorInputChange } from '../../actions';
import { formatCurrency, isPresent } from '../../utils/helpers';

class VetTecApprovedPrograms extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedProgram: props.preSelectedProgram };
    this.setProgramFields(props.preSelectedProgram);
  }

  setProgramFields = programName => {
    if (programName) {
      const program = this.props.institution.programs.find(
        p => p.description.toLowerCase() === programName.toLowerCase(),
      );
      if (program) {
        const field = 'vetTecProgram';
        const value = {
          vetTecTuitionFees: program.tuitionAmount,
          vetTecProgramName: program.description,
          vetTecProgramFacilityCode: this.props.institution.facilityCode,
        };
        this.props.calculatorInputChange({ field, value });
      }
    }
  };

  handleInputChange = (event, index, vetTecProgramName) => {
    this.setState({ selectedProgram: vetTecProgramName });
    this.setProgramFields(vetTecProgramName);
  };

  render() {
    const programs = this.props.institution.programs;
    if (programs && programs.length) {
      const programRows = programs.map((program, index) => {
        const programLength = isPresent(program.lengthInHours)
          ? `${program.lengthInHours} hours`
          : 'TBD';
        const tuition = isPresent(program.tuitionAmount)
          ? formatCurrency(program.tuitionAmount)
          : 'TBD';
        const checked =
          this.state.selectedProgram &&
          program.description.toLowerCase() ===
            this.state.selectedProgram.toLowerCase();
        return (
          <tr key={index}>
            <td className="vads-u-padding-y--0">
              <div className="form-radio-buttons gids-radio-buttons">
                <input
                  id={`radio-${index}`}
                  name="vetTecProgram"
                  checked={checked}
                  className="gids-radio-buttons-input"
                  type="radio"
                  value={program.description}
                  onChange={e =>
                    this.handleInputChange(e, index, program.description)
                  }
                />
                <label id={`program-${index}`} htmlFor={`radio-${index}`}>
                  {program.description}
                </label>
              </div>
            </td>
            <td className="vads-u-padding-y--0">{programLength}</td>
            <td className="vads-u-padding-y--0">{tuition}</td>
          </tr>
        );
      });

      return (
        <div className="vads-u-margin-top--2">
          <span>Select a program below to view your estimated benefits.</span>
          <table className="vet-tec-programs-table">
            <colgroup>
              <col className="name-col" />
              <col className="hours-col" />
              <col className="tuition-col" />
            </colgroup>
            <thead>
              <tr>
                <th className="vads-u-padding-left--5" id="program-name-header">
                  Program name
                </th>
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

VetTecContactInformation.propTypes = {
  institution: PropTypes.object,
  preSelectedProgram: PropTypes.string,
};

const mapDispatchToProps = { calculatorInputChange };

export default connect(
  null,
  mapDispatchToProps,
)(VetTecApprovedPrograms);
