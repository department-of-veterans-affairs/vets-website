import React from 'react';

function lastSection(chapter) {
  return chapter.pages.slice(-1)[0].path;
}

function determineChapterStyles(pageState, formChapter, currentUrl) {
  let classes = '';
  if (formChapter.pages.some(page => page.path === currentUrl)) {
    classes += ' section-current';
  }
  if (formChapter.pages.length > 0 && pageState[lastSection(formChapter)].complete) {
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
 * Component for navigation, with links to each page of the form.
 * Parent links redirect to first page link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 * `pages` - A hash of page names and the current validation state and fields
 * `chapters` - A list of the chapters in the nav and their pages
 */
class Nav extends React.Component {
  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const { pages, currentUrl, chapters } = this.props;

    return (
      <ol className="process form-process">
        {chapters.map((chapter, i) => {
          return (
            <li role="presentation" className={`${getStepClassFromIndex(i, chapters.length)} ${subnavStyles}
              ${determineChapterStyles(pages, chapter, currentUrl)}`} key={chapter.name}>
              <div>
                <h5>{chapter.name}</h5>
                <ul className="usa-unstyled-list">
                  {chapter.pages.filter(page => page.name).map(page => {
                    return (
                      <li className={`${determineSectionStyles(page.path, currentUrl)}`} key={page.path}>
                        {page.name}
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
  pages: React.PropTypes.object.isRequired,
  chapters: React.PropTypes.array.isRequired
};

export default Nav;
