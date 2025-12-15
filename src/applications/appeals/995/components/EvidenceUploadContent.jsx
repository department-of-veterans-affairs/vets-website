import React from 'react';
import PropTypes from 'prop-types';
import { content } from '../content/evidence/summary';
import { EVIDENCE_UPLOAD_URL, ATTACHMENTS_OTHER } from '../constants';
import {
  confirmationPageLabel,
  errorClassNames,
  listClassNames,
  removeButtonClass,
} from '../utils/evidence-classnames';
import BasicLink from '../../shared/components/web-component-wrappers/BasicLink';

/**
 * Build uploaded evidence list
 * @param {Object[]} list - Uploaded evidence array
 * @param {Boolean} reviewMode - When true, hide editing links & buttons
 * @param {Boolean} isOnReviewPage - When true, list is rendered on review page
 * @param {Object} handlers - Event callback functions for links & buttons
 * @param {Boolean} testing - testing Links using data-attr; Links don't render
 *  an href when not wrapped in a Router
 * @returns {JSX}
 */
export const EvidenceUploadContent = ({
  list = [],
  isOnReviewPage,
  reviewMode = false,
  handlers = {},
  testing,
  showListOnly = false,
}) => {
  if (!list?.length) {
    return null;
  }
  const Header = isOnReviewPage ? 'h5' : 'h4';
  const SubHeader = isOnReviewPage ? 'h6' : 'h5';

  return (
    <>
      <Header className={`upload-title ${confirmationPageLabel(showListOnly)}`}>
        {content.otherTitle}
      </Header>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="evidence-summary remove-bullets" role="list">
        {list.map((upload, index) => {
          const errors = {
            attachmentId: upload.attachmentId
              ? ''
              : content.missing.attachmentId,
          };
          const hasErrors = Object.values(errors).join('');

          return (
            <li
              key={upload.name + index}
              className={
                hasErrors ? errorClassNames : listClassNames(!showListOnly)
              }
            >
              <SubHeader
                className="upload-file dd-privacy-hidden overflow-wrap-word vads-u-margin-y--0 vads-u-font-weight--bold"
                data-dd-action-name="Uploaded document file name"
              >
                {upload.name}
              </SubHeader>
              <div>
                {errors.attachmentId ||
                  ATTACHMENTS_OTHER[upload.attachmentId] ||
                  ''}
              </div>
              {!reviewMode && (
                <div className="vads-u-margin-top--1p5">
                  <BasicLink
                    disableAnalytics
                    id={`edit-upload-${index}`}
                    className="edit-item"
                    path={`/${EVIDENCE_UPLOAD_URL}#${index}`}
                    aria-label={`${content.editLinkAria} ${upload.name}`}
                    data-link={testing ? EVIDENCE_UPLOAD_URL : null}
                    text={content.edit}
                  />
                  <va-button
                    data-index={index}
                    data-type="upload"
                    onClick={handlers.showModal}
                    class={removeButtonClass}
                    label={`${content.delete} ${upload.name}`}
                    text={content.delete}
                    secondary
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

EvidenceUploadContent.propTypes = {
  handlers: PropTypes.shape({}),
  isOnReviewPage: PropTypes.bool,
  list: PropTypes.array,
  reviewMode: PropTypes.bool,
  showListOnly: PropTypes.bool,
  testing: PropTypes.bool,
};
