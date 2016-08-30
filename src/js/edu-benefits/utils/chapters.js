import _ from 'lodash';

const chapters = {
  veteranInformation: 'Veteran Information',
  benefitsEligibility: 'Benefits Eligibility',
  militaryHistory: 'Military History',
  educationHistory: 'Education History',
  employmentHistory: 'Employment History',
  schoolSelection: 'School Selection',
  review: 'Review'
};

export function groupPagesIntoChapters(routes) {
  const sectionList = routes
    .filter(route => route.props.chapter)
    .map(section => {
      return {
        name: section.props.name,
        chapter: section.props.chapter,
        path: section.props.path
      };
    });
  const chapterList = _.groupBy(sectionList, section => section.chapter);

  return Object.keys(chapterList).map(chapter => {
    return {
      name: chapter,
      sections: chapters[chapter]
    };
  });
}

export default chapters;
