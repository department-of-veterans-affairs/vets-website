import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router';

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

  institutionIsBeingViewed = institution =>
    institution.facilityCode === this.props.institution.facilityCode;

  shouldHideViewMore = (branches, extensions) => {
    let totalRows = 1 + branches.length + extensions.length; // always has a main row
    branches.forEach(branch => {
      totalRows += branch.extensions.length;
    });
    return totalRows > DEFAULT_ROWS_VIEWABLE && !this.state.viewMore;
  };

  linkTo = (facilityCode, name) => {
    const { version } = this.props;
    const linkTo = {
      pathname: `profile/${facilityCode}`,
      query: version ? { version } : {},
    };

    return <Link to={linkTo}>{name}</Link>;
  };

  handleViewMoreClicked = () => {
    this.setState({ ...this.state, viewMore: true });
  };

  estimatedHousingRow = institution => {
    const { giBillBenefit } = this.props.calculator;

    if (giBillBenefit === 'yes') {
      return `${formatCurrency(this.props.constants.AVGVABAH)}/mo`;
    } else if (giBillBenefit === 'no') {
      return `${formatCurrency(institution.dodBah)}/mo`;
    }
    return 'TBD';
  };

  renderRow = (institution, type, nameLabel = institution.institution) => {
    const label = this.institutionIsBeingViewed(institution) ? (
      <b>{nameLabel}</b>
    ) : (
      nameLabel
    );

    return (
      <tr key={`${institution.facilityCode}-${type}`}>
        <td>{label}</td>
        <td>
          {institution.physicalCity}, {institution.physicalState}{' '}
          {institution.physicalZip}
        </td>
        <td>{this.estimatedHousingRow(institution)}</td>
      </tr>
    );
  };

  renderMainRow = institution => {
    const nameLabel = this.institutionIsBeingViewed(institution)
      ? `${institution.institution} (Main Campus)`
      : this.linkTo(
          institution.facilityCode,
          `${institution.institution} (Main Campus)`,
        );
    return this.renderRow(institution, 'main', nameLabel);
  };

  renderExtensions = (rows, extensions, defaultRowsAdjusted) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!this.state.viewMore && rows.length >= defaultRowsAdjusted) {
        break;
      }
      rows.push(this.renderRow(extension, 'extension'));
    }

    return rows;
  };

  renderBranches = (rows, branches, defaultRowsAdjusted) => {
    for (const branch of branches) {
      const { institution } = branch;
      const nameLabel = this.institutionIsBeingViewed(branch)
        ? institution.institution
        : this.linkTo(institution.facilityCode, institution.institution);

      // check if should add more rows
      if (!this.state.viewMore && rows.length >= defaultRowsAdjusted) {
        break;
      }
      rows.push(this.renderRow(institution, 'branch', nameLabel));

      for (const extension of branch.extensions) {
        // check if should add more rows
        if (!this.state.viewMore && rows.length >= defaultRowsAdjusted) {
          break;
        }
        rows.push(this.renderRow(extension, 'extension'));
      }
    }

    return rows;
  };

  renderBranchesAndExtensionsRows = ({ branches, extensions }) => {
    let rows = [];
    const defaultRowsAdjusted = DEFAULT_ROWS_VIEWABLE - 1;

    rows = this.renderExtensions(rows, extensions, defaultRowsAdjusted);

    return this.renderBranches(rows, branches, defaultRowsAdjusted);
  };

  renderFacilityMapTable = main => (
    <table>
      <thead>
        <tr>
          <th>School Name</th>
          <th>Location</th>
          <th>Estimated Housing</th>
        </tr>
      </thead>
      <tbody>
        {this.renderMainRow(main.institution)}
        {this.renderBranchesAndExtensionsRows(main)}
      </tbody>
    </table>
  );

  renderViewMore = main => {
    if (this.shouldHideViewMore(main.branches, main.extensions)) {
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
      <div>
        <span>
          Below are locations for {main.institution.institution}. Select a link
          to view another location and calculate the benefits you’d receive
          there.
        </span>
        {this.renderFacilityMapTable(main)}
        {this.renderViewMore(main)}
      </div>
    );
  }
}

export default SchoolLocations;
