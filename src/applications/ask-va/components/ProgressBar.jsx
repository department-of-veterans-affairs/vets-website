import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { CHAPTER_1, CHAPTER_2, CHAPTER_3 } from '../constants';
import {
  aboutMyselfRelationshipVeteranPages,
  aboutMyselfRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutVeteranPages,
  aboutSomeoneElseRelationshipFamilyMemberAboutFamilyMemberPages,
  aboutSomeoneElseRelationshipVeteranOrFamilyMemberEducationPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkPages,
  aboutSomeoneElseRelationshipConnectedThroughWorkEducationPages,
  generalQuestionPages,
} from '../config/schema-helpers/formFlowHelper';

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

const ProgressBar = ({ pathname }) => {
  const [percent, setPercent] = useState(0);
  const [viewedPages, setViewedPages] = useState([]);
  const [pagePercent, setPagePercent] = useState({});

  const currentPath = pathname.replace('/', '');
  const constantPaths = [
    getPathsFromChapter(CHAPTER_1),
    getPathsFromChapter(CHAPTER_2),
    CHAPTER_3.RELATIONSHIP_TO_VET.PATH,
  ].flat();
  const isConstantPath = showProgressBar(currentPath, constantPaths);
  const flowPaths = findFlowPages(formPages);
  const isFlowPath = showProgressBar(currentPath, flowPaths);
  const onReviewPage = currentPath === 'review-then-submit';
  const onCategoryPage = currentPath === CHAPTER_1.PAGE_1.PATH;

  useEffect(
    () => {
      document.activeElement.blur();
      focusElement('.ava-progress-bar > h2');
      setViewedPages([...viewedPages, currentPath]);

      if (!viewedPages.includes(currentPath) && percent < 100) {
        if (onCategoryPage) {
          setPercent(0);
          setPagePercent({ ...pagePercent, [currentPath]: percent });
        }
        if (
          isConstantPath &&
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
    },
    [currentPath],
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
  pathname: PropTypes.string,
};

export default ProgressBar;
