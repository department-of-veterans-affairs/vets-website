import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import HeadingHierarchyAnalyzer from '../../../utils/HeadingHierarchyAnalyzer';

const PreXs = styled.pre`
  font-size: 0.75rem;
`;

/**
 * @component HeadingHierarchyInspector - analyzes and displays the heading hierarchy of a page,
 * highlighting any accessibility issues in the heading structure. It automatically
 * re-runs analysis when the route changes and displays both errors and a visual
 * representation of the heading tree hierarchy.
 *
 * @param {Object} props
 * @param {Object} props.location - Router location object from withRouter HOC.
 *                                 Used to trigger re-analysis on route changes.
 *
 * @dependencies
 * - Requires HeadingHierarchyAnalyzer utility
 * - Wrapped with withRouter HOC for location updates
 */
const HeadingHierarchyInspectorBase = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = () => {
    setIsOpen(false);
    const analyzer = new HeadingHierarchyAnalyzer();
    const results = analyzer.analyze();
    setAnalysis(results);
    setIsOpen(true);
  };

  useEffect(() => {
    setAnalysis(null);
    setTimeout(() => {
      runAnalysis();
    }, 500);
  }, [location]);

  return (
    <div>
      {!isOpen ? (
        <p>Loading heading analysis...</p>
      ) : (
        <div className="vads-l-grid-container--full-width vads-u-padding--0p5 vads-u-border--1px vads-u-border-color--gray-light">
          <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-border-bottom--1px vads-u-border-color--gray-light">
            <p className="vads-u-margin--0 vads-u-font-size--sm vads-u-font-weight--bold vads-u-padding-left--0p5">
              Heading Hierarchy
              {analysis?.issues?.length > 0 ? (
                <span className="vads-u-font-size--sm vads-u-color--secondary-dark vads-u-margin-y--0p5 vads-u-margin-left--0p5">
                  Issues Found ({analysis.issues.length})
                </span>
              ) : (
                <span className="vads-u-font-size--sm vads-u-color--success vads-u-margin-y--0p5 vads-u-display--flex vads-u-align-items--center">
                  <va-icon icon="check" size={2} /> No heading issues found
                </span>
              )}
            </p>
          </div>

          <div className="vads-u-padding-bottom--0p5">
            {analysis?.issues?.length > 0 && (
              <div className="vads-u-margin-bottom--1">
                <ul className="usa-unstyled-list vads-u-margin-y--0">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="vads-u-margin-y--0">
                      <va-alert slim status="error">
                        <div className="vads-u-margin--0">
                          <p className="vads-u-font-weight--bold vads-u-margin-y--0 vads-u-font-size--sm">
                            {issue.message}
                          </p>
                          {issue.prevText && (
                            <p className="vads-u-color--gray-dark vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-font-size--sm">
                              h{issue.prevLevel}: {issue.prevText}
                            </p>
                          )}
                          {issue.text && (
                            <p className="vads-u-font-size--sm vads-u-color--gray-dark vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                              h{issue.level}: {issue.text}
                            </p>
                          )}
                        </div>
                      </va-alert>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="vads-u-margin-bottom--1 vads-u-background-color--gray-lightest">
              <PreXs className="vads-u-padding--0p5 vads-u-margin--0">
                {analysis &&
                  new HeadingHierarchyAnalyzer().generateTreeText(
                    analysis.tree,
                  )}
              </PreXs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

HeadingHierarchyInspectorBase.propTypes = {
  location: PropTypes.object.isRequired,
};

export const HeadingHierarchyInspector = withRouter(
  HeadingHierarchyInspectorBase,
);
