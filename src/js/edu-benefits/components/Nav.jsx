import React from 'react';

function lastSection(panel) {
  return panel.sections.slice(-1)[0].path;
}

function determinePanelStyles(path, sectionState, formPanel, currentUrl) {
  let classes = '';
  if (currentUrl.startsWith(path)) {
    classes += ' section-current';
  }
  if (sectionState[path] && sectionState[path].complete) {
    classes += ' section-complete';
  } else if (formPanel.sections.length > 0 && sectionState[lastSection(formPanel)].complete) {
    classes += ' section-complete';
  }
  return classes;
}

function determineSectionStyles(name, currentUrl) {
  return currentUrl === name ? ' sub-section-current' : '';
}

function getStepClassFromIndex(index, length) {
  const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const lastClass = (index + 1) === length ? 'last' : '';

  return (index + 1) < numbers.length ? `${numbers[index]} ${lastClass}` : lastClass;
}

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 * `sections` - A hash of section names and the current validation state and fields
 * `panels` - A list of the panels in the nav and their sub-sections
 */
class Nav extends React.Component {
  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const { sections, currentUrl, panels } = this.props;

    return (
      <ol className="process form-process">
        {panels.map((panel, i) => {
          return (
            <li role="presentation" className={`${getStepClassFromIndex(i, panels.length)} ${subnavStyles}
              ${determinePanelStyles(panel.path, sections, panel, currentUrl)}`} key={panel.path}>
              <div>
                <h5>{panel.name}</h5>
                <ul className="usa-unstyled-list">
                  {panel.sections.map(section => {
                    return (
                      <li className={`${determineSectionStyles(section.path, currentUrl)}`} key={section.path}>
                        {section.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
}

Nav.propTypes = {
  currentUrl: React.PropTypes.string.isRequired,
  sections: React.PropTypes.object.isRequired,
  panels: React.PropTypes.array.isRequired
};

export default Nav;
