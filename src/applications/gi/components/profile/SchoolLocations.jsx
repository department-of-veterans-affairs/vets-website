import PropTypes from 'prop-types';
import React from 'react';
import { getCalculatedBenefits } from '../../selectors/calculator';

const TOTAL_ROWS_DISPLAYED_WITHOUT_VIEW_MORE = 15;
const DEFAULT_ROWS_VIEWABLE = 10;

export class SchoolLocations extends React.Component {
  static propTypes = {
    institution: PropTypes.object,
    facilityMap: PropTypes.object,
    calculator: PropTypes.object,
    constants: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { viewMore: false };
  }

  institutionIsBeingViewed = facilityCode =>
    facilityCode === this.props.institution.facilityCode;

  shouldHideViewMore = (facilityMap, maxRows) =>
    this.totalRows(facilityMap) > maxRows && !this.state.viewMore;

  totalRows = ({ branches, extensions }) => {
    let totalRows = 1 + branches.length + extensions.length; // always has a main row
    branches.forEach(branch => {
      totalRows += branch.extensions.length;
    });
    return totalRows;
  };

  numberOfRowsToDisplay = facilityMap => {
    const totalRows = this.totalRows(facilityMap);

    return totalRows > DEFAULT_ROWS_VIEWABLE &&
      totalRows <= TOTAL_ROWS_DISPLAYED_WITHOUT_VIEW_MORE
      ? TOTAL_ROWS_DISPLAYED_WITHOUT_VIEW_MORE
      : DEFAULT_ROWS_VIEWABLE;
  };

  createLinkTo = (facilityCode, name) => {
    if (this.institutionIsBeingViewed(facilityCode)) {
      return name;
    }
    const { version } = this.props;
    const query = version ? `?version=${version}` : '';

    return <a href={`${facilityCode}${query}`}>{name}</a>;
  };

  handleViewMoreClicked = () => {
    this.setState({ viewMore: true });
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
          {physicalCity}, {physicalState} {physicalZip}
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
      if (!this.state.viewMore && rows.length >= maxRows - 1) {
        break;
      }
      const nameLabel = (
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {extension.institution}
        </span>
      );
      rows.push(this.renderRow(extension, 'extension', nameLabel));
    }
  };

  renderBranchRows = (rows, branches, maxRows) => {
    for (const branch of branches) {
      // check if should add more rows
      if (!this.state.viewMore && rows.length >= maxRows - 1) {
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
    const maxRows = this.numberOfRowsToDisplay(main);
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
    const maxRows = this.numberOfRowsToDisplay(main);
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
      if (!this.state.viewMore && rows.length >= maxRows - 1) {
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
      if (!this.state.viewMore && rows.length >= maxRows - 1) {
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
          {physicalCity}, {physicalState} {physicalZip}
        </div>
        <div>Estimated housing: {this.estimatedHousingRow(institution)}</div>
      </div>
    );
  };

  renderViewMore = main => {
    const maxRows = this.numberOfRowsToDisplay(main);

    if (this.shouldHideViewMore(main, maxRows)) {
      return (
        <button
          type="button"
          className="va-button-link learn-more-button"
          onClick={this.handleViewMoreClicked}
        >
          View more...
        </button>
      );
    }
    return null;
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
        {this.renderViewMore(main)}
      </div>
    );
  }
}

export default SchoolLocations;
