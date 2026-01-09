import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  aboutMyselfRelationshipFamilyMemberPages,
  aboutMyselfRelationshipVeteranPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
  aboutSomeoneElseRelationshipVeteranPages,
  generalQuestionPages,
} from '../config/schema-helpers/formFlowHelper';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3 } from '../constants';

const formPages = [
  aboutMyselfRelationshipVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberPages,
  aboutMyselfRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
  generalQuestionPages,
];

const skipPaths = [
  'category-requires-sign-in',
  'topic-requires-sign-in',
  'your-question-requires-sign-in',
  'review-then-submit',
];

const getFormDataKeys = (flowList, pagePath) => {
  // Keys for custom pages with no schema properties and/or not in flowPaths list
  if (pagePath === 'initial-question') return 'initialQuestion';
  if (pagePath === CHAPTER_1.PAGE_1.PATH) return 'selectCategory';
  if (pagePath === CHAPTER_1.PAGE_2.PATH) return 'selectTopic';
  if (pagePath === CHAPTER_1.PAGE_3.PATH) return 'selectSubtopic';
  if (pagePath === CHAPTER_2.PAGE_1.PATH) return 'whoIsYourQuestionAbout';
  if (pagePath === CHAPTER_3.RELATIONSHIP_TO_VET.PATH)
    return 'relationshipToVeteran';
  if (pagePath === CHAPTER_2.PAGE_3.PATH)
    return ['question', 'subject', 'fileUpload'];

  const pageInFlow = flowList.filter(question => question.path === pagePath);
  return pageInFlow[0]?.title === 'Your VA health facility'
    ? 'yourHealthFacility'
    : Object.keys(pageInFlow[0]?.schema?.properties);
};

const getPathsFromChapter = chapter => {
  const chapterValues = Object.values(chapter);
  return chapterValues
    .map(item => item.PATH)
    .filter(item => item !== undefined);
};

const showProgressBar = (path, list) => {
  if (typeof list[0] === 'object') {
    const currentPath = list.filter(pageInfo => pageInfo.path === path);
    return currentPath.length > 0;
  }
  return list.includes(path);
};

const findFlowPages = flows => {
  const allFlowPages = flows.map(pageGroup => Object.values(pageGroup));
  return allFlowPages.flat();
};

const ProgressBar = ({ pathname, formData, setFormData, emptyFormData }) => {
  const [percent, setPercent] = useState(0);
  const [viewedPages, setViewedPages] = useState([]);
  const [invalidPages, setInvalidPages] = useState([]);
  const [pagePercent, setPagePercent] = useState({});
  const [formCopy, setFormCopy] = useState({});
  const currentPath = pathname.replace('/', '');
  const constantPaths = [
    'initial-question',
    getPathsFromChapter(CHAPTER_1),
    getPathsFromChapter(CHAPTER_2),
    CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
  ].flat();
  const isConstantPath = showProgressBar(currentPath, constantPaths);
  const flowPaths = findFlowPages(formPages);
  const isFlowPath = showProgressBar(currentPath, flowPaths);
  const onReviewPage = currentPath === 'review-then-submit';
  const onCategoryPage = currentPath === CHAPTER_1.PAGE_1.PATH;

  const removeViewedFromInvalidPages = (invalid, viewed) =>
    invalid.filter(page => !viewed.includes(page));

  const buildReplacementObj = keys => {
    const replaceWith = {};
    keys.forEach(key => {
      replaceWith[key] = emptyFormData[key];
    });
    return replaceWith;
  };

  useEffect(
    () => {
      // Scroll back to the top of the form
      scrollTo('topScrollElement');
      focusElement('h2');
      if (!viewedPages.includes(currentPath))
        setViewedPages([...viewedPages, currentPath]);

      if (!viewedPages.includes(currentPath) && percent < 100) {
        if (currentPath === 'initial-question') {
          setPercent(0);
          setPagePercent({ ...pagePercent, [currentPath]: percent });
        }
        if (onCategoryPage) {
          setPercent(10);
          setPagePercent({ ...pagePercent, [currentPath]: percent });
        }
        if (
          isConstantPath &&
          currentPath !== 'initial-question' &&
          currentPath !== CHAPTER_2.PAGE_3.PATH &&
          currentPath !== CHAPTER_1.PAGE_1.PATH
        ) {
          setPercent(percent + 5);
          setPagePercent({ ...pagePercent, [currentPath]: percent + 5 });
        }
        if (isFlowPath) {
          setPercent(percent + 3);
          setPagePercent({ ...pagePercent, [currentPath]: percent + 3 });
        }
        if (isConstantPath && currentPath === CHAPTER_2.PAGE_3.PATH) {
          setPercent(90);
          setPagePercent({ ...pagePercent, [currentPath]: 90 });
        }
        if (onReviewPage) {
          setPercent(98);
          setPagePercent({ ...pagePercent, [currentPath]: 98 });
        }
        setFormCopy(cloneDeep(formData));
      }

      if (viewedPages.includes(currentPath) && percent < 100 && percent >= 0) {
        if (onCategoryPage) setPercent(pagePercent[currentPath]);
        if (
          isConstantPath &&
          currentPath !== CHAPTER_2.PAGE_3.PATH &&
          currentPath !== CHAPTER_1.PAGE_1.PATH
        )
          setPercent(pagePercent[currentPath]);
        if (isFlowPath) setPercent(pagePercent[currentPath]);
        if (isConstantPath && currentPath === CHAPTER_2.PAGE_3.PATH)
          setPercent(pagePercent[currentPath]);
        if (onReviewPage) setPercent(pagePercent[currentPath]);
      }

      if (onReviewPage && invalidPages.length > 0) {
        const invalidKeys = invalidPages
          .filter(path => !skipPaths.includes(path))
          .map(pagePath => getFormDataKeys(flowPaths, pagePath))
          .flat();

        const questionKeys = viewedPages
          .filter(
            path =>
              path !== 'review-then-submit' &&
              path !== 'your-personal-information',
          )
          .map(pagePath => getFormDataKeys(flowPaths, pagePath))
          .flat();

        const filteredInvalid = removeViewedFromInvalidPages(
          invalidKeys,
          questionKeys,
        );
        const clearWith = buildReplacementObj(filteredInvalid);

        if (Object.keys(clearWith).length)
          setFormData({ ...formData, ...clearWith });
      }
    },
    [currentPath],
  );

  useEffect(
    () => {
      if (
        viewedPages.includes(currentPath) &&
        viewedPages.indexOf(currentPath) !== viewedPages.length - 1 &&
        !isEqual(formCopy, formData)
      ) {
        const nextPageIndex = viewedPages.indexOf(currentPath) + 1;
        const viewedPagesToClearData = viewedPages.slice(nextPageIndex);
        setInvalidPages([...invalidPages, ...viewedPagesToClearData]);

        const resetViewedPagesToCurrentPath = viewedPages.slice(
          0,
          nextPageIndex,
        );
        setViewedPages(resetViewedPagesToCurrentPath);
      }
    },
    [formData],
  );

  return isConstantPath || isFlowPath || onReviewPage ? (
    <div className="ava-progress-bar">
      <div
        className="ava-progress-bar-inner"
        style={{ width: `${percent}%` }}
      />
      <h2 className="vads-u-font-size--h6 vads-u-margin-top--1p5">{`${percent}% complete with form`}</h2>
    </div>
  ) : null;
};

ProgressBar.propTypes = {
  emptyFormData: PropTypes.object,
  formData: PropTypes.object,
  pathname: PropTypes.string,
  setFormData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
    emptyFormData: state.form.data.initialFormData,
  };
}

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ProgressBar));
