import React from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import PropTypes from 'prop-types';
import VetTecContactInformation from './VetTecContactInformation';
import { calculatorInputChange } from '../../actions';
import { formatCurrency } from '../../utils/helpers';

class VetTecApprovedPrograms extends React.Component {
  handleInputChange = (event, vetTecProgramName) => {
    const { name: field, value: vetTecTuitionFees } = event.target;
    const value = {
      vetTecTuitionFees,
      vetTecProgramName,
    };
    this.props.calculatorInputChange({ field, value });
  };

  render() {
    const programs = this.props.institution.programs;
    // prod flag for CT 116 story 19614
    if (!environment.isProduction() && programs && programs.length) {
      const programRows = programs.map((program, index) => (
        <tr key={index}>
          <td>
            <div className="form-radio-buttons gids-radio-buttons">
              <input
                id={`radio-${index}`}
                name="vetTecProgram"
                className="gids-radio-buttons-input"
                type="radio"
                value={program.tuitionAmount}
                onChange={e => this.handleInputChange(e, program.description)}
                aria-labelledby={`program-${index}`}
              />
              <label id={`program-${index}`} htmlFor={`radio-${index}`}>
                {program.description}
              </label>
            </div>
          </td>
          <td>{`${program.lengthInHours} hours`}</td>
          <td>{formatCurrency(program.tuitionAmount)}</td>
        </tr>
      ));

      return (
        <div>
          <p>Select a program below to view your estimated benefits.</p>
          <table className="vet-tec-programs-table">
            <colgroup>
              <col className="name-col" />
              <col className="hours-col" />
              <col className="tuition-col" />
            </colgroup>
            <thead>
              <tr>
                <th className="name-th">Program name</th>
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
};

const mapDispatchToProps = { calculatorInputChange };

export default connect(
  null,
  mapDispatchToProps,
)(VetTecApprovedPrograms);
