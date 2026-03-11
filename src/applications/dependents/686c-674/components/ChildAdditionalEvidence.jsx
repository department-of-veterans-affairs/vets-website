import React from 'react';
import { useSelector } from 'react-redux';

import readableList from 'platform/forms-system/src/js/utilities/data/readableList';

import { childEvidence } from '../config/utilities';
import {
  MAX_FILE_SIZE_MB,
  MAX_TOTAL_FILE_SIZE_GB,
  SUPPORTED_UPLOAD_TYPES,
} from '../config/constants';

/**
 * Renders child additional evidence component
 * @returns {JSX} Child additional evidence component
 */
export const ChildAdditionalEvidence = () => {
  const formData = useSelector(state => {
    return state?.form?.data || {};
  });

  const {
    showBirthCertificate,
    hasAdoptedChild,
    hasDisabledChild,
  } = childEvidence(formData);

  const fileTypes = SUPPORTED_UPLOAD_TYPES.map(type => `.${type}`);
  return (
    <div>
      <p>
        Based on your answers, you’ll need to submit supporting evidence to add
        this child as your dependent.
      </p>
      <p>
        You can upload your files online now, or send us your documents later.
        If you want to send us your documents later, we’ll provide instructions
        at the end of this form.
      </p>
      {showBirthCertificate || hasDisabledChild || hasAdoptedChild ? (
        <va-accordion open-single>
          <va-accordion-item
            id="supporting-evidence"
            header="Supporting evidence you need to submit"
            level="4"
          >
            <ul>
              {showBirthCertificate && (
                <li>A copy of your child’s birth certificate</li>
              )}
              {hasDisabledChild && (
                <>
                  <li>
                    Copies of medical records that document your child’s
                    permanent physical or mental disability,{' '}
                    <strong>and</strong>
                  </li>
                  <li>
                    A statement from your child’s doctor that shows the type and
                    severity of the child’s physical or mental disability
                  </li>
                </>
              )}
              {hasAdoptedChild && (
                <li>
                  A copy of one of these documents:
                  <ul>
                    <li>
                      The final decree of adoption, <strong>or</strong>
                    </li>
                    <li>
                      The adoptive placement agreement, <strong>or</strong>
                    </li>
                    <li>
                      The interlocutory decree of adoptions, <strong>or</strong>
                    </li>
                    <li>The revised birth certificate</li>
                  </ul>
                </li>
              )}
            </ul>
          </va-accordion-item>
        </va-accordion>
      ) : null}
      <h4>Submit your files online</h4>
      <p className="upload-details">
        {`You can upload a ${readableList(fileTypes, 'or')} format. Files can’t
        be larger than ${MAX_FILE_SIZE_MB} MB, and the total size of all uploads
        can’t be more than ${MAX_TOTAL_FILE_SIZE_GB} GB`}
        .
      </p>
    </div>
  );
};
