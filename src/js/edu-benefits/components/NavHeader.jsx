import React from 'react';

import { groupSections } from '../utils/sections';

export default class NavHeader extends React.Component {
  render() {
    const path = this.props.path;
    const panels = groupSections();
    const total = panels.length;

    let step;
    let name;
    panels
      .forEach((panel, index) => {
        if (panel.sections.some(section => section.path === path)) {
          step = index + 1;
          name = panel.name;
        }
      });

    return (
      <h4 className="show-for-small-only"><span className="form-process-step current">{step}</span> of {total} {name}</h4>
    );
  }
}

NavHeader.propTypes = {
  path: React.PropTypes.string.isRequired
};
