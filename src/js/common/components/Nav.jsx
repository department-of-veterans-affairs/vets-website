import React from 'react';
import classnames from 'classnames';

import { isActivePage } from '../utils/helpers';

function allPagesComplete(data, pageState, pages) {
  return pages.filter(page => isActivePage(page, data)).every(page => pageState[page.path].complete);
}

function determineChapterStyles(data, pageState, formChapter, currentUrl) {
  return classnames(
    { 'section-current': formChapter.pages.some(page => page.path === currentUrl) },
    { 'section-complete': formChapter.pages.length > 0 && allPagesComplete(data, pageState, formChapter.pages) }
  );
}

function determinePageStyles(page, currentUrl, data) {
  return classnames(
    { 'sub-section-current': currentUrl === page.path },
    { 'sub-section-hidden': !isActivePage(page, data) }
  );
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
    const { data, pages, currentUrl, chapters } = this.props;

    return (
      <ol className="process form-process">
        {chapters.map((chapter, i) => {
          return (
            <li role="presentation" className={`${getStepClassFromIndex(i, chapters.length)} ${subnavStyles}
              ${determineChapterStyles(data, pages, chapter, currentUrl)}`} key={chapter.name}>
              <div>
                <h5>{chapter.name}</h5>
                <ul className="usa-unstyled-list">
                  {chapter.pages.length > 1 ? chapter.pages.map(page => {
                    return (
                      <li className={`${determinePageStyles(page, currentUrl, data)}`} key={page.path}>
                        {page.name}
                      </li>
                    );
                  }) : null}
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
  data: React.PropTypes.object,
  chapters: React.PropTypes.array.isRequired
};

export default Nav;
