import React from 'react';

const formPanels = [
  {
    path: '/benefits-eligibility',
    name: 'Benefits Eligibility',
    classes: 'one',
    sections: []
  },
  {
    path: '/military-history',
    name: 'Military History',
    classes: 'two',
    sections: [
      { path: '/military-history/service', name: 'Military Service' },
      { path: '/military-history/rotc-history', name: 'ROTC History' },
      { path: '/military-history/benefits-history', name: 'Benefits History' }
    ]
  },
  {
    path: '/education-history',
    name: 'Education History',
    classes: 'three',
    sections: []
  },
  {
    path: '/employment-history',
    name: 'Employment History',
    classes: 'four',
    sections: []
  },
  {
    path: '/school-selection',
    name: 'School Selection',
    classes: 'five',
    sections: []
  },
  {
    path: '/veteran-information',
    name: 'Veteran Information',
    classes: 'six',
    sections: [
      { path: '/veteran-information/personal-information', name: 'Personal Information' },
      { path: '/veteran-information/address', name: 'Address' },
      { path: '/veteran-information/contact', name: 'Contact Information' },
      { path: '/veteran-information/secondary-contact', name: 'Secondary Contact' },
      { path: '/veteran-information/dependent-information', name: 'Dependent Information' },
      { path: '/veteran-information/direct-deposit', name: 'Direct Deposit' },
    ]
  },
  {
    path: '/review-and-submit',
    name: 'Review',
    classes: 'seven last',
    sections: []
  }];

function determinePanelStyles(path, sectionState, formPanel, currentUrl) {
  let classes = '';
  if (currentUrl.startsWith(path)) {
    classes += ' section-current';
  }
  if (sectionState[path] && sectionState[path].complete) {
    classes += ' section-complete';
  } else if (formPanel.sections.length > 0 && sectionState[formPanel.sections.slice(-1)[0].path].complete) {
    classes += ' section-complete';
  }
  return classes;
}

function determineSectionStyles(name, currentUrl) {
  return currentUrl === name ? ' sub-section-current' : '';
}

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 */
class Nav extends React.Component {
  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const { sections, currentUrl } = this.props;

    return (
      <ol className="process form-process">
        {formPanels.map(panel => {
          return (<li role="presentation" className={`${panel.classes} ${subnavStyles}
           ${determinePanelStyles(panel.path, sections, panel, currentUrl)}`} key={panel.path}>
            <div>
              <h5>{panel.name}</h5>
              <ul className="usa-unstyled-list">
                {panel.sections.map(subSection => {
                  return (<li className={`${determineSectionStyles(subSection.path, currentUrl)}`} key={subSection.path}>
                    {subSection.name}
                  </li>);
                })}
              </ul>
            </div>
          </li>);
        })}
      </ol>
    );
  }
}

Nav.propTypes = {
  currentUrl: React.PropTypes.string.isRequired,
  sections: React.PropTypes.object.isRequired
};

export default Nav;
