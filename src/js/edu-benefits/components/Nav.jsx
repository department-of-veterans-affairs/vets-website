import React from 'react';

function lastSection(chapter) {
  return chapter.sections.slice(-1)[0].path;
}

function determineChapterStyles(sectionState, formChapter, currentUrl) {
  let classes = '';
  if (formChapter.sections.some(section => section.path === currentUrl)) {
    classes += ' section-current';
  }
  if (formChapter.sections.length > 0 && sectionState[lastSection(formChapter)].complete) {
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
 * `chapters` - A list of the chapters in the nav and their sub-sections
 */
class Nav extends React.Component {
  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const { sections, currentUrl, chapters } = this.props;

    return (
      <ol className="process form-process">
        {chapters.map((chapter, i) => {
          return (
            <li role="presentation" className={`${getStepClassFromIndex(i, chapters.length)} ${subnavStyles}
              ${determineChapterStyles(sections, chapter, currentUrl)}`} key={chapter.name}>
              <div>
                <h5>{chapter.name}</h5>
                <ul className="usa-unstyled-list">
                  {chapter.sections.filter(section => section.name).map(section => {
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
  chapters: React.PropTypes.array.isRequired
};

export default Nav;
