import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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

const ProgressBar = ({ pathname, categoryID }) => {
  const [percent, setPercent] = useState(0);
  const [viewedPages, setViewedPages] = useState([]);

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

  useEffect(
    () => {
      setViewedPages([...viewedPages, currentPath]);

      if (!viewedPages.includes(currentPath)) {
        if (isConstantPath && currentPath !== CHAPTER_2.PAGE_3.PATH)
          setPercent(percent + 5);
        if (isFlowPath) setPercent(percent + 3);
        if (isConstantPath && currentPath === CHAPTER_2.PAGE_3.PATH)
          setPercent(90);
        if (onReviewPage) setPercent(98);
      }
    },
    [currentPath],
  );

  useEffect(
    () => {
      if (currentPath === CHAPTER_1.PAGE_1.PATH && viewedPages.length > 1) {
        setPercent(5);
        setViewedPages([]);
      }
    },
    [categoryID],
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
  categoryID: PropTypes.string,
  pathname: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    categoryID: state.askVA.categoryID,
  };
}

export default connect(mapStateToProps)(ProgressBar);
