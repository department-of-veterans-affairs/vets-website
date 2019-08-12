import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { Link } from 'react-router';

const DEFAULT_BRANCHES_VIEWABLE = 10;

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
      { ...institution, name: 'A Ext', facilityCode: '01' },
      { ...institution, name: 'B Ext', facilityCode: '02' },
      { ...institution, name: 'C Ext', facilityCode: '03' },
    ];
    // const branches = [
    //   {
    //     ...institution,
    //     name: 'A Branch',
    //     extensions,
    //     facilityCode: '11',
    //   },
    //   {
    //     ...institution,
    //     name: 'C Branch',
    //     extensions: [],
    //     facilityCode: '12',
    //   },
    // ];

    const branches = [
      {
        ...institution,
        name: 'A Branch',
        extensions,
        facilityCode: '11',
      },
      {
        ...institution,
        name: 'C Branch',
        extensions: [],
        facilityCode: '12',
      },
      {
        ...institution,
        name: 'D Branch',
        extensions,
        facilityCode: '13',
      },
      {
        ...institution,
        name: 'E Branch',
        extensions: [],
        facilityCode: '14',
      },
      {
        ...institution,
        name: 'F Branch',
        extensions,
        facilityCode: '15',
      },
      {
        ...institution,
        name: 'G Branch',
        extensions: [],
        facilityCode: '16',
      },
      {
        ...institution,
        name: 'H Branch',
        extensions,
        facilityCode: '17',
      },
      {
        ...institution,
        name: 'I Branch',
        extensions: [],
        facilityCode: '18',
      },
      {
        ...institution,
        name: 'J Branch',
        extensions,
        facilityCode: '19',
      },
      {
        ...institution,
        name: 'K Branch',
        extensions: [],
        facilityCode: '20',
      },
      {
        ...institution,
        name: 'L Branch',
        extensions,
        facilityCode: '21',
      },
      {
        ...institution,
        name: 'M Branch',
        extensions: [],
        facilityCode: '22',
      },
    ];

    return {
      main: {
        ...institution,
        branches,
      },
    };
  };

  institutionIsBeingViewed = institution =>
    institution.facilityCode === this.props.institution.facilityCode;

  shouldHideBranches = branches =>
    branches.length > DEFAULT_BRANCHES_VIEWABLE && !this.state.viewMore;

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

  renderBranches = branches => {
    const rows = [];

    let renderBranches = branches;
    if (this.shouldHideBranches(branches)) {
      renderBranches = branches.slice(0, DEFAULT_BRANCHES_VIEWABLE);
    }

    renderBranches.forEach(branch => {
      const nameLabel = this.institutionIsBeingViewed(branch)
        ? branch.name
        : this.linkTo(branch.facilityCode, branch.name);

      rows.push(this.renderRow(branch, 'branch', nameLabel));

      branch.extensions.forEach(extension => {
        rows.push(this.renderRow(extension, 'extension'));
      });
    });
    return rows;
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
        {this.renderBranches(main.branches)}
      </tbody>
    </table>
  );

  renderViewMore = main => {
    if (this.shouldHideBranches(main.branches)) {
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
