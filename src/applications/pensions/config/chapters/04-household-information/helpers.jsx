import get from 'platform/forms-system/src/js/utilities/data/get';
import moment from 'moment';
import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';
import titleCase from 'platform/utilities/data/titleCase';
import { createSelector } from 'reselect';
import { Title } from 'platform/forms-system/src/js/web-component-patterns';
import React from 'react';

export function isSeparated(formData) {
  return formData.maritalStatus === 'SEPARATED';
}

export function isMarried(form = {}) {
  return ['MARRIED', 'SEPARATED'].includes(form.maritalStatus);
}

export function doesHaveDependents(formData) {
  return get(['view:hasDependents'], formData) === true;
}

export function isCurrentMarriage(formData, index) {
  const numMarriages =
    formData && formData.marriages ? formData.marriages.length : 0;
  return isMarried(formData) && numMarriages - 1 === index;
}

export function currentSpouseHasFormerMarriages(formData) {
  return isMarried(formData) && formData.currentSpouseMaritalHistory === 'YES';
}

export function showSpouseAddress(formData) {
  return (
    isMarried(formData) &&
    (formData.maritalStatus === 'SEPARATED' ||
      get(['view:liveWithSpouse'], formData) === false)
  );
}

export function isBetween18And23(childDOB) {
  return moment(childDOB).isBetween(
    moment()
      .startOf('day')
      .subtract(23, 'years'),
    moment()
      .startOf('day')
      .subtract(18, 'years'),
  );
}

export function dependentIsOutsideHousehold(formData, index) {
  // if 'view:hasDependents' is false,
  // all checks requiring dependents must be false
  return (
    doesHaveDependents(formData) &&
    !get(['dependents', index, 'childInHousehold'], formData)
  );
}

export function getMarriageTitle(index) {
  const desc = numberToWords(index + 1);
  return `${titleCase(desc)} marriage`;
}

export function getMarriageTitleWithCurrent(form, index) {
  if (isMarried(form) && form.marriages.length - 1 === index) {
    return 'Current marriage';
  }

  return getMarriageTitle(index);
}

export function getDependentChildTitle(item, description) {
  if (item.fullName) {
    return `${item.fullName.first || ''} ${item.fullName.last ||
      ''} ${description}`;
  }
  return description;
}

export function createSpouseLabelSelector(nameTemplate) {
  return createSelector(
    form =>
      form.marriages && form.marriages.length
        ? form.marriages[form.marriages.length - 1].spouseFullName
        : null,
    spouseFullName => {
      if (spouseFullName) {
        return {
          title: nameTemplate(spouseFullName),
        };
      }

      return {
        title: null,
      };
    },
  );
}

export const MarriageTitle = title => <Title title={title} />;
