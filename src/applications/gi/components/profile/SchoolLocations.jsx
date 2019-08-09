import PropTypes from 'prop-types';
import React from 'react';

export class SchoolLocations extends React.Component {
  static propTypes = {
    institution: PropTypes.object,
    institutionTree: PropTypes.object,
  };

  static defaultProps = {
    institutionTree: {},
  };

  getInstitutionTree = () => {
    const { institution } = this.props;
    const branches = [
      { ...institution, name: 'A Branch' },
      { ...institution, name: 'B Branch' },
    ];
    const extensions = [
      { ...institution, name: 'A Ext' },
      { ...institution, name: 'B Ext' },
      { ...institution, name: 'C Ext' },
    ];
    return {
      mainCampus: { ...institution },
      branches,
      extensions,
    };
  };

  render() {
    const institutionTree = this.getInstitutionTree();
    return (
      <div>
        Below are locations for {institutionTree.mainCampus.name}. Select a link
        to view another location and calculate the benefits you’d receive there.
      </div>
    );
  }
}

export default SchoolLocations;
