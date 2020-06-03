import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, isPresent } from '../../utils/helpers';
import classNames from 'classnames';

class VetTecApprovedProgramsList extends React.Component {
  programLength = program =>
    isPresent(program.lengthInHours) && program.lengthInHours !== '0'
      ? `${program.lengthInHours} hours`
      : 'TBD';

  programTuition = program =>
    isPresent(program.tuitionAmount)
      ? formatCurrency(program.tuitionAmount)
      : 'TBD';

  isProgramSelected = (program, selectedProgram) =>
    selectedProgram &&
    program.description.toLowerCase() === selectedProgram.toLowerCase();

  programRows = () => {
    const {
      selectedProgram,
      institution: { programs },
    } = this.props;

    return programs.map((program, index) => {
      const selected = this.isProgramSelected(program, selectedProgram);
      const programDescriptionClassNames = classNames('vads-l-col--10', {
        'vads-u-font-weight--bold': selected,
      });
      return (
        <tr key={`${index}-table`}>
          <th
            scope="row"
            className="vads-u-padding-left--0 vads-l-grid-container"
          >
            <div className="program-description vads-l-row">
              <div className={programDescriptionClassNames}>
                {program.description}
                {selected ? <b> (Your selected program)</b> : null}
              </div>
            </div>
          </th>
          <td id="program-length" className="vads-u-padding-y--0">
            {this.programLength(program)}
          </td>
          <td className="vads-u-padding-y--0">
            {this.programTuition(program)}
          </td>
        </tr>
      );
    });
  };

  programList = () => {
    const {
      selectedProgram,
      institution: { programs },
    } = this.props;

    return programs.map((program, index) => {
      const selected = this.isProgramSelected(program, selectedProgram);

      const programDescriptionClassNames = classNames('program-description', {
        'vads-u-font-weight--bold': selected,
      });
      return (
        <div key={`${index}-list`}>
          {index > 0 && <hr aria-hidden="true" />}
          <div className={programDescriptionClassNames}>
            {program.description}
            {selected ? <b> (Your selected program)</b> : null}
          </div>
          <div id="program-length">
            <b>Length: </b>
            {this.programLength(program)}
          </div>
          <div>
            <b>Tuition and fees: </b>
            {this.programTuition(program)}
          </div>
        </div>
      );
    });
  };

  render() {
    const {
      institution: { programs },
    } = this.props;

    if (programs && programs.length) {
      return (
        <div className="vads-u-margin-top--2">
          <span>The following training programs are approved for VET TEC:</span>
          <div className="vet-tec-programs-list vads-u-margin-top--4">
            {this.programList()}
          </div>
          <table className="vet-tec-programs-table">
            <colgroup>
              <col className="name-col" />
              <col className="hours-col" />
              <col className="tuition-col" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" id="program-name-header">
                  Program name
                </th>
                <th scope="col">Length</th>
                <th scope="col">Tuition & Fees</th>
              </tr>
            </thead>
            <tbody>{this.programRows()}</tbody>
          </table>
          <div className="vads-u-margin-top--4 vads-u-font-style--italic">
            Showing {programs.length} of {programs.length} programs
          </div>
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

VetTecApprovedProgramsList.propTypes = {
  institution: PropTypes.object,
  selectedProgram: PropTypes.string,
};

export default VetTecApprovedProgramsList;
