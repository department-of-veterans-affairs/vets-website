import PropTypes from 'prop-types';
import React from 'react';
import { getCalculatedBenefits } from '../../selectors/calculator';
import { locationInfo } from '../../utils/helpers';

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

    return <a href={`${facilityCode}${query}`}>{name}</a>;
  };

  handleViewAllClicked = () => {
    this.setState({
      viewableRowCount: this.state.totalRowCount,
      viewAll: true,
    });
  };

  handleViewLessClicked = () => {
    if (this.props.onViewLess) {
      this.props.onViewLess();
    }
    this.setState({
      viewableRowCount: this.state.initialRowCount,
      viewAll: false,
    });
  };

  showMoreClicked = () => {
    const remainingRowCount =
      this.state.totalRowCount - this.state.viewableRowCount;
    if (remainingRowCount >= NEXT_ROWS_VIEWABLE) {
      this.setState({
        viewableRowCount: this.state.viewableRowCount + NEXT_ROWS_VIEWABLE,
      });
    } else {
      this.setState({
        viewableRowCount: this.state.viewableRowCount + remainingRowCount,
      });
    }
  };

  schoolLocationTableInfo = (city, state, country, zip) => {
    let address = locationInfo(city, state, country);
    if (country === 'USA' && zip) {
      address = `${address} ${zip}`;
    }
    return address;
  };

  estimatedHousingRow = institution => {
    const fakeState = {
      constants: { constants: this.props.constants },
      eligibility: this.props.eligibility,
      profile: { attributes: institution },
      calculator: this.props.calculator,
    };

    const calculated = getCalculatedBenefits(fakeState, this.props);
    return calculated.outputs.housingAllowance.value;
  };

  renderRow = (institution, type, name = institution.institution) => {
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    } = institution;
    const nameLabel = this.institutionIsBeingViewed(facilityCode) ? (
      <p className="schoolName">{name}</p>
    ) : (
      name
    );
    return (
      <tr key={`${facilityCode}-${type}`} className={`${type}-row`}>
        <td>{nameLabel}</td>
        <td className={'location-cell'}>
          {this.schoolLocationTableInfo(
            physicalCity,
            physicalState,
            physicalCountry,
            physicalZip,
          )}
        </td>
        <td>{this.estimatedHousingRow(institution)}</td>
      </tr>
    );
  };

  renderMainRow = institution =>
    this.renderRow(
      institution,
      'main',
      this.createLinkTo(
        institution.facilityCode,
        `${institution.institution} (Main Campus)`,
      ),
    );

  renderExtensionRows = (rows, extensions, maxRows) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }
      const nameLabel = (
        <div className="vads-u-padding-left--1">{extension.institution}</div>
      );
      rows.push(this.renderRow(extension, 'extension', nameLabel));
    }
  };

  renderBranchRows = (rows, branches, maxRows) => {
    for (const branch of branches) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }

      const { institution } = branch;
      const { facilityCode, institution: name } = institution;

      rows.push(
        this.renderRow(
          institution,
          'branch',
          this.createLinkTo(facilityCode, name),
        ),
      );

      this.renderExtensionRows(rows, branch.extensions, maxRows);
    }
  };

  renderBranchesAndExtensionsRows = ({ branches, extensions }, maxRows) => {
    const rows = [];
    this.renderExtensionRows(rows, extensions, maxRows);
    this.renderBranchRows(rows, branches, maxRows);
    return rows;
  };

  renderFacilityMapTable = main => {
    const maxRows = this.state.viewableRowCount;
    return (
      <table className="locations-table">
        <thead>
          <tr>
            <th>School Name</th>
            <th>Location</th>
            <th>Estimated housing</th>
          </tr>
        </thead>
        <tbody>
          {this.renderMainRow(main.institution)}
          {this.renderBranchesAndExtensionsRows(main, maxRows)}
        </tbody>
      </table>
    );
  };

  renderFacilityMapList = main => {
    const maxRows = this.state.viewableRowCount;
    return (
      <div className="locations-list">
        {this.renderMainListItem(main.institution)}
        {this.renderBranchesAndExtensionsList(main, maxRows)}
      </div>
    );
  };

  renderMainListItem = institution =>
    this.renderItem(
      institution,
      'main',
      this.createLinkTo(
        institution.facilityCode,
        `${institution.institution} (Main Campus)`,
      ),
    );

  renderBranchesAndExtensionsList = ({ branches, extensions }, maxRows) => {
    const rows = [];
    this.renderExtensionItems(rows, extensions, maxRows);
    this.renderBranchItems(rows, branches, maxRows);
    return rows;
  };

  renderBranchItems = (rows, branches, maxRows) => {
    for (const branch of branches) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }

      const { institution } = branch;
      const { facilityCode, institution: name } = institution;

      rows.push(
        this.renderItem(
          institution,
          'branch',
          this.createLinkTo(facilityCode, name),
        ),
      );

      this.renderExtensionItems(rows, branch.extensions, maxRows);
    }
  };

  renderExtensionItems = (rows, extensions, maxRows) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!this.state.viewAll && rows.length >= maxRows - 1) {
        break;
      }
      const nameLabel = <span>{extension.institution}</span>;
      rows.push(this.renderItem(extension, 'extension', nameLabel));
    }
  };

  renderItem = (institution, type, name = institution.institution) => {
    const {
      facilityCode,
      physicalCity,
      physicalState,
      physicalCountry,
      physicalZip,
    } = institution;
    const nameLabel = this.institutionIsBeingViewed(facilityCode) ? (
      <h6>{name}</h6>
    ) : (
      name
    );

    return (
      <div key={`${facilityCode}-${type}`} className={`${type} item`}>
        <div>{nameLabel}</div>
        <div className={'location-cell'}>
          {this.schoolLocationTableInfo(
            physicalCity,
            physicalState,
            physicalCountry,
            physicalZip,
          )}
        </div>
        <div>Estimated housing: {this.estimatedHousingRow(institution)}</div>
      </div>
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
              <i className="fas fa-chevron-down fa-xs vads-u-padding-left--1" />
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
          Showing {viewableRows} out of {totalRows}
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
        {this.renderFacilityMapTable(main)}
        {this.renderFacilityMapList(main)}
        {this.renderViewCount()}
        {this.renderViewButtons()}
      </div>
    );
  }
}

export default SchoolLocations;
