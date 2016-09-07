import _ from 'lodash';

export function getPageList(routes) {
  return routes.map(route => route.props.path).filter(page => page !== '/submit-message');
}

export function groupPagesIntoChapters(routes) {
  const pageList = routes
    .filter(route => route.props.chapter)
    .map(page => {
      return {
        name: page.props.name,
        chapter: page.props.chapter,
        path: page.props.path
      };
    });
  const pageGroups = _.groupBy(pageList, page => page.chapter);

  return Object.keys(pageGroups).map(chapter => {
    return {
      name: chapter,
      pages: pageGroups[chapter]
    };
  });
}

export const chapterNames = {
  veteranInformation: 'Veteran Information',
  benefitsEligibility: 'Benefits Eligibility',
  militaryHistory: 'Military History',
  educationHistory: 'Education History',
  employmentHistory: 'Employment History',
  schoolSelection: 'School Selection',
  review: 'Review'
};
