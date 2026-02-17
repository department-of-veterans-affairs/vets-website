import React from 'react';
import { useSelector } from 'react-redux';

import { childEvidence } from '../config/utilities';

/**
 * Renders child additional evidence component
 * @returns {JSX} Child additional evidence component
 */
export const ChildAdditionalEvidence = () => {
  const formData = useSelector(state => {
    return state?.form?.data || {};
  });

  const { showBirthCertificate, hasAdoptedChild, hasDisabledChild } =
    childEvidence(formData);

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
      <p>You can upload your files now.</p>
      <va-additional-info trigger="Document upload instructions" disable-border>
        <div>
          <ul>
            <li>File types you can upload: JPEG, JPG, PNG or PDF</li>
            <li>
              You can upload multiple files, but they have to add up to 10 MB or
              less
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
};
