import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router';

const DEFAULT_ROWS_VIEWABLE = 10;

export class SchoolLocations extends React.Component {
  static propTypes = {
    institution: PropTypes.object,
    institutionTree: PropTypes.object,
    calculator: PropTypes.object,
    constants: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { viewMore: false };
  }

  getInstitutionTree = () => {
    const { institution } = this.props;
    const extensions = [
      { institution: { ...institution, name: 'A Ext', facilityCode: '01' } },
      { institution: { ...institution, name: 'B Ext', facilityCode: '02' } },
      { institution: { ...institution, name: 'C Ext', facilityCode: '03' } },
    ];

    const branches = [
      {
        institution: {
          ...institution,
          name: 'A Branch',
          facilityCode: '11',
        },
        extensions,
      },
      {
        institution: {
          ...institution,
          name: 'C Branch',
          facilityCode: '12',
        },
        extensions: [],
      },
      {
        institution: {
          ...institution,
          name: 'D Branch',
          facilityCode: '13',
        },
        extensions,
      },
      {
        institution: {
          ...institution,
          name: 'E Branch',
          facilityCode: '14',
        },
        extensions: [],
      },
    ];

    return {
      main: {
        ...institution,
        branches,
        extensions: [
          {
            institution: {
              ...institution,
              name: 'A Main Ext',
              facilityCode: '011',
            },
          },
          {
            institution: {
              ...institution,
              name: 'B Main Ext',
              facilityCode: '021',
            },
          },
          {
            institution: {
              ...institution,
              name: 'C Main Ext',
              facilityCode: '031',
            },
          },
        ],
      },
    };
  };

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

  renderRow = (institution, type, nameLabel = institution.name) => {
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

  renderMainRow = main => {
    const nameLabel = this.institutionIsBeingViewed(main)
      ? `${main.name} (Main Campus)`
      : this.linkTo(main.facilityCode, `${main.name} (Main Campus)`);
    return this.renderRow(main, 'main', nameLabel);
  };

  renderExtensions = (rows, extensions, defaultRowsAdjusted) => {
    for (const extension of extensions) {
      // check if should add more rows
      if (!this.state.viewMore && rows.length >= defaultRowsAdjusted) {
        break;
      }
      rows.push(this.renderRow(extension.institution, 'extension'));
    }

    return rows;
  };

  renderBranches = (rows, branches, defaultRowsAdjusted) => {
    for (const branch of branches) {
      const { institution } = branch;
      const nameLabel = this.institutionIsBeingViewed(branch)
        ? institution.name
        : this.linkTo(institution.facilityCode, institution.name);

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
        rows.push(this.renderRow(extension.institution, 'extension'));
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

  renderInstitutionTreeTable = main => (
    <table>
      <thead>
        <tr>
          <th>School Name</th>
          <th>Location</th>
          <th>Estimated Housing</th>
        </tr>
      </thead>
      <tbody>
        {this.renderMainRow(main)}
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
    const { main } = this.getInstitutionTree();
    return (
      <div>
        <span>
          Below are locations for {main.name}. Select a link to view another
          location and calculate the benefits you’d receive there.
        </span>
        {this.renderInstitutionTreeTable(main)}
        {this.renderViewMore(main)}
      </div>
    );
  }
}

export default SchoolLocations;
