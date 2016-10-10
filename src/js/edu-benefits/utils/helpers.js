import _ from 'lodash';
import moment from 'moment';

export function getPageList(routes) {
  return routes.map(route => {
    const obj = {
      name: route.props.path,
      label: route.props.name
    };
    if (route.props.depends) {
      obj.depends = route.props.depends;
    }
    return obj;
  }).filter(page => page.name !== '/submit-message');
}

export function groupPagesIntoChapters(routes) {
  const pageList = routes
    .filter(route => route.props.chapter)
    .map(page => {
      const obj = {
        name: page.props.name,
        chapter: page.props.chapter,
        path: page.props.path
      };

      if (page.props.depends) {
        obj.depends = page.props.depends;
      }

      return obj;
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
  personalInformation: 'Personal Information',
  review: 'Review'
};

export function getLabel(options, value) {
  const matched = _.find(options, option => option.value === value);

  return matched ? matched.label : null;
}

export function showSchoolAddress(educationType) {
  return educationType === 'college'
    || educationType === 'flightTraining'
    || educationType === 'apprenticeship'
    || educationType === 'correspondence';
}

export function dateToMoment(dateField) {
  return moment({
    year: dateField.year.value,
    month: dateField.month.value - 1,
    day: dateField.day.value
  });
}

export function displayDateIfValid(dateObject) {
  if (typeof dateObject === 'object') {
    const momentDate = dateToMoment(dateObject);
    if (momentDate.isValid()) {
      return momentDate.format('M/D/YYYY');
    }
  }
  return null;
}

export function showSomeoneElseServiceQuestion(claimType) {
  return claimType !== ''
    && claimType !== 'vocationalRehab';
}

export function hasServiceBefore1978(data) {
  return data.toursOfDuty.some(tour => {
    const fromDate = dateToMoment(tour.dateRange.from);
    return fromDate.isValid() && fromDate.isBefore('1978-01-02');
  });
}

export function showRelinquishedEffectiveDate(benefitsRelinquished) {
  return benefitsRelinquished !== '' && benefitsRelinquished !== 'unknown';
}

export function getListOfBenefits(veteran) {
  const benefitList = [];

  if (veteran.chapter30) {
    benefitList.push('Montgomery GI Bill (MGIB or Chapter 30) Education Assistance Program');
  }

  if (veteran.chapter33) {
    benefitList.push('Post-9/11 GI Bill (Chapter 33)');
  }

  if (veteran.chapter1606) {
    benefitList.push('Montgomery GI Bill Selected Reserve (MGIB-SR or Chapter 1606) Educational Assistance Program');
  }

  if (veteran.chapter32) {
    benefitList.push('Post-Vietnam Era Veterans\' Educational Assistance Program (VEAP or chapter 32)');
  }

  return benefitList;
}

export function showYesNo(field) {
  if (field.value === '') {
    return '';
  }

  return field.value === 'Y' ? 'Yes' : 'No';
}
