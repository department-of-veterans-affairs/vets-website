import PropTypes from 'prop-types';
import React from 'react';
import { getCalculatedBenefits } from '../../selectors/calculator';
import { locationInfo } from '../../utils/helpers';
import ResponsiveTable from '../ResponsiveTable';
import { Link } from 'react-router-dom';

const DEFAULT_ROWS_VIEWABLE = window.innerWidth > 781 ? 10 : 5;

const NEXT_ROWS_VIEWABLE = 10;

export class SchoolLocations extends React.Component {
  static propTypes = {
    institution: PropTypes.object,
    facilityMap: PropTypes.object,
    calculator: PropTypes.object,
    constants: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const initialViewableRows = this.numberOfRowsToDisplay(
      props.institution.facilityMap.main,
    );
    this.state = {
      viewAll: false,
      viewableRowCount: initialViewableRows,
      initialRowCount: initialViewableRows,
      totalRowCount: this.totalRows(props.institution.facilityMap.main),
    };
  }

  institutionIsBeingViewed = facilityCode =>
    facilityCode === this.props.institution.facilityCode;

  totalRows = ({ branches, extensions }) => {
    let totalRows = 1 + branches.length + extensions.length; // always has a main row
    branches.forEach(branch => {
      totalRows += branch.extensions.length;
    });
    return totalRows;
  };

  numberOfRowsToDisplay = facilityMap => {
    const totalRows = this.totalRows(facilityMap);

    return totalRows > DEFAULT_ROWS_VIEWABLE
      ? DEFAULT_ROWS_VIEWABLE
      : totalRows;
  };

  createLinkTo = (facilityCode, name) => {
    if (this.institutionIsBeingViewed(facilityCode)) {
      return name;
    }
    const { version } = this.props;
    const query = version ? `?version=${version}` : '';

    return (
      <div className="school-name">
        <Link to={`${facilityCode}${query}`}>{name}</Link>
      </div>
    );
  };

  handleViewAllClicked = async () => {
    const previousRowCount = this.state.viewableRowCount;
    await this.setState({
      viewableRowCount: this.state.totalRowCount,
      viewAll: true,
    });
    this.setFocusToSchoolNameCell(previousRowCount);
  };

  handleViewLessClicked = async () => {
    if (this.props.onViewLess) {
      this.props.onViewLess();
    }
    await this.setState({
      viewableRowCount: this.state.initialRowCount,
      viewAll: false,
    });
    this.setFocusToSchoolNameCell(0);
  };

  showMoreClicked = async () => {
    const previousRowCount = this.state.viewableRowCount;
    const remainingRowCount =
      this.state.totalRowCount - this.state.viewableRowCount;
    const newViewableRowCount =
      remainingRowCount >= NEXT_ROWS_VIEWABLE
        ? this.state.viewableRowCount + NEXT_ROWS_VIEWABLE
        : this.state.viewableRowCount + remainingRowCount;
    await this.setState({
      viewableRowCount: newViewableRowCount,
    });
    this.setFocusToSchoolNameCell(previousRowCount);
  };

  // Necessary so screen reader users are aware that the school locations table has changed.
  setFocusToSchoolNameCell = elementIndex => {
    document.getElementsByClassName('school-name-cell')[elementIndex].focus();
  };

  schoolLocationTableInfo = (city, state, country, zip) => {
    let address = locationInfo(city, state, country);
    if (country === 'USA' && zip) {
      address = `${address} ${zip}`;
    }
    return address;
  };

  estimatedHousingValue = institution => {
    const fakeState = {
      constants: { constants: this.props.constants },
      eligibility: this.props.eligibility,
      profile: { attributes: institution },
      calculator: this.props.calculator,
    };

    const calculated = getCalculatedBenefits(fakeState, this.props);
    return calculated.outputs.housingAllowance.value;
  };

  createRow = (institution, type, name = institution.institution) => {
    const month = (
      <React.Fragment key="months">
        <span className="sr-only">per month</span>
        <span aria-hidden="true">/mo</span>
      </React.Fragment>
    );
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    } = institution;
    const nameLabel = this.institutionIsBeingViewed(facilityCode) ? (
      <p className="school-name">{name}</p>
    ) : (
      name
    );

    const schoolName =
      type === 'main'
        ? nameLabel
        : {
            value: nameLabel,
            mobileHeader: type.charAt(0).toUpperCase() + type.slice(1),
          };

    return {
      key: `${facilityCode}-${type}`,
      rowClassName: `${type}-row`,
      'School name': schoolName,
      Location: this.schoolLocationTableInfo(
        physicalCity,
        physicalState,
        physicalCountry,
        physicalZip,
      ),
      'Estimated housing': (
        <>
          {this.estimatedHousingValue(institution)}
          {month}
        </>
      ),
    };
  };

  createMainRow = institution =>
    this.createRow(
      institution,
      'main',
      this.createLinkTo(
        institution.facilityCode,
        `${institution.institution} (Main Campus)`,
      ),
    );

  createExtensionRows = (rows, extensions, maxRows) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }
      const nameLabel = (
        <div className="extension-cell-label">{extension.institution}</div>
      );
      rows.push(this.createRow(extension, 'extension', nameLabel));
    }
  };

  createBranchRows = (rows, branches, maxRows) => {
    for (const branch of branches) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }

      const { institution } = branch;
      const { facilityCode, institution: name } = institution;

      rows.push(
        this.createRow(
          institution,
          'branch',
          this.createLinkTo(facilityCode, name),
        ),
      );

      this.createExtensionRows(rows, branch.extensions, maxRows);
    }
  };

  createBranchesAndExtensionsRows = ({ branches, extensions }, maxRows) => {
    const rows = [];
    this.createExtensionRows(rows, extensions, maxRows);
    this.createBranchRows(rows, branches, maxRows);
    return rows;
  };

  renderFacilityTable = main => {
    const maxRows = this.state.viewableRowCount;

    const fields = ['School name', 'Location', 'Estimated housing'];

    const data = Array.of(this.createMainRow(main.institution)).concat(
      this.createBranchesAndExtensionsRows(main, maxRows),
    );

    return (
      <ResponsiveTable
        columns={fields}
        tableClass="school-locations"
        data={data}
      />
    );
  };

  renderViewButtons = () => {
    const viewableRowCount = this.state.viewableRowCount;
    const totalRowCount = this.state.totalRowCount;

    if (totalRowCount > DEFAULT_ROWS_VIEWABLE) {
      if (viewableRowCount !== totalRowCount) {
        const remainingRowCount = totalRowCount - viewableRowCount;
        const showNextCount =
          remainingRowCount < NEXT_ROWS_VIEWABLE
            ? remainingRowCount
            : NEXT_ROWS_VIEWABLE;
        return (
          <div className="vads-u-padding-top--1">
            <button
              type="button"
              className="va-button-link learn-more-button"
              onClick={this.showMoreClicked}
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
      return (
        <div className="vads-u-padding-top--1">
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
    return null;
  };

  renderViewCount = () => {
    const totalRows = this.state.totalRowCount;
    const viewableRows = this.state.viewableRowCount;
    return (
      <div className="vads-u-padding-top--2">
        <i>
          Showing {viewableRows} of {totalRows} locations
        </i>
      </div>
    );
  };

  render() {
    const { main } = this.props.institution.facilityMap;
    return (
      <div className="school-locations row">
        <span>
          Below are locations for {main.institution.institution}. The housing
          estimates shown here are based on a full-time student taking in-person
          classes.&nbsp;
          {main.branches.length > 0 && ( // only displayed when branches exist
            <span>
              Select a link to view a location and calculate the benefits you’d
              receive there.
            </span>
          )}
        </span>
        {this.renderFacilityTable(main)}
        {this.renderViewCount()}
        {this.renderViewButtons()}
      </div>
    );
  }
}

export default SchoolLocations;
