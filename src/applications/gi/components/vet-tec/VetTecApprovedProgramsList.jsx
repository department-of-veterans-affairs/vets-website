import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, isPresent, createId } from '../../utils/helpers';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';

const DEFAULT_ROWS_VIEWABLE = 5;
const MINIMUM_ROWS_FOR_PAGING = 10;
const NEXT_ROWS_VIEWABLE = 10;

class VetTecApprovedProgramsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewAll: false,
      displayAmount: this.usePaging()
        ? DEFAULT_ROWS_VIEWABLE
        : props.programs.length,
    };
  }

  usePaging = () => this.props.programs.length > MINIMUM_ROWS_FOR_PAGING;

  programs = () => {
    const { programs } = this.props;
    const { viewAll } = this.state;
    return viewAll ? programs : programs.slice(0, this.state.displayAmount);
  };

  programDescription = (program, additionalClassName) => {
    const { selectedProgram } = this.props;
    const selected = this.isProgramSelected(program, selectedProgram);
    const className = classNames(additionalClassName, {
      'vads-u-font-weight--bold': selected,
    });

    return (
      <div className={className}>
        {program.description}
        {selected ? <b> (Your selected program)</b> : null}
      </div>
    );
  };

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

  handleAccordionFocus = () => {
    const accordionId = `${createId('Approved programs')}-accordion`;
    const field = document.getElementById(accordionId);
    if (field) {
      field.scrollIntoView();
      focusElement(`#${accordionId} button`);
    }
  };

  handleViewAllClicked = async () => {
    const { displayAmount } = this.state;
    await this.setState({
      displayAmount: this.props.programs.length,
      viewAll: true,
    });
    this.setFocusToProgramNameCell(displayAmount);
  };

  handleViewLessClicked = async () => {
    await this.setState({
      displayAmount: DEFAULT_ROWS_VIEWABLE,
      viewAll: false,
    });
    this.handleAccordionFocus();
    this.setFocusToProgramNameCell(0);
  };

  handleShowMoreClicked = async () => {
    const { programs } = this.props;
    const { displayAmount } = this.state;
    const remainingRowCount = programs.length - displayAmount;
    if (remainingRowCount > NEXT_ROWS_VIEWABLE) {
      await this.setState({
        displayAmount: displayAmount + NEXT_ROWS_VIEWABLE,
      });
    } else {
      await this.setState({
        displayAmount: programs.length,
        viewAll: true,
      });
    }
    this.setFocusToProgramNameCell(displayAmount);
  };

  // Necessary so screen reader users are aware that the approved programs table has changed.
  setFocusToProgramNameCell = elementIndex => {
    document
      .getElementsByClassName('program-description-header')
      [elementIndex].focus();
  };

  renderProgramRows = () => {
    return this.programs().map((program, index) => {
      return (
        <tr key={`${index}-table`}>
          <th
            tabIndex="-1"
            scope="row"
            className="vads-u-padding-left--0 vads-l-grid-container program-description-header"
          >
            <div className="program-description vads-l-row">
              {this.programDescription(program, 'vads-l-col--10')}
            </div>
          </th>
          <td className="program-length vads-u-padding-y--0">
            {this.programLength(program)}
          </td>
          <td className="vads-u-padding-y--0">
            {this.programTuition(program)}
          </td>
        </tr>
      );
    });
  };

  renderProgramList = () => {
    return this.programs().map((program, index) => {
      return (
        <div key={`${index}-list`}>
          {index > 0 && <hr aria-hidden="true" />}
          {this.programDescription(program, 'program-description')}
          <div className="program-length">
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

  renderPageControls = () => {
    const { programs } = this.props;

    if (this.usePaging()) {
      const { viewAll, displayAmount } = this.state;

      if (viewAll) {
        return (
          <div>
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.handleViewLessClicked}
            >
              ...View less
            </button>
          </div>
        );
      }
      const remainingRowCount = programs.length - displayAmount;
      const showNextCount =
        remainingRowCount < NEXT_ROWS_VIEWABLE
          ? remainingRowCount
          : NEXT_ROWS_VIEWABLE;

      return (
        <div>
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={this.handleShowMoreClicked}
          >
            Show next {showNextCount}
            <i
              className="fas fa-chevron-down fa-xs vads-u-padding-left--1"
              aria-hidden="true"
            />
          </button>
          <span className="vads-u-padding--2">|</span>
          <button
            type="button"
            className="va-button-link learn-more-button"
            onClick={this.handleViewAllClicked}
          >
            View all
          </button>
        </div>
      );
    }
    return null;
  };

  render() {
    const { programs } = this.props;

    if (programs && programs.length) {
      return (
        <div className="vads-u-margin-top--2">
          <span>The following training programs are approved for VET TEC:</span>
          <div className="vet-tec-programs-list vads-u-margin-top--4">
            {this.renderProgramList()}
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
            <tbody>{this.renderProgramRows()}</tbody>
          </table>
          <div className="vads-u-margin-top--4 vads-u-font-style--italic">
            Showing {this.programs().length} of {programs.length} programs
          </div>
          {this.renderPageControls()}
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
  programs: PropTypes.arrayOf(PropTypes.object),
  selectedProgram: PropTypes.string,
};

export default VetTecApprovedProgramsList;
