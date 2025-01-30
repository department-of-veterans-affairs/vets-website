import React from 'react';

export const ChildAdditionalEvidence = () => {
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
      <va-accordion>
        <va-accordion-item
          id="supporting-evidence"
          header="Supporting evidence you need to submit"
        >
          <ul>
            <li>A copy of your child’s birth certificate</li>
            <li>
              Copies of medical records that document your child’s permanent
              physical or mental disability, and
              <ul>
                <li>
                  A statement from your child’s doctor that shows the type and
                  severity of the child’s physical or mental disability
                </li>
              </ul>
            </li>
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
          </ul>
        </va-accordion-item>
      </va-accordion>
      <h3>Submit your files online</h3>
      <p>You can upload your files now.</p>
      <va-additional-info
        trigger="Document upload instructions"
        disable-border
        uswds
      >
        <div>
          <ul>
            <li>File types you can upload: JPEG, JPG, PNG or PDF</li>
            <li>
              You can upload multiple files, but they have to add up to 10 MB or
              less.
            </li>
          </ul>
        </div>
      </va-additional-info>
    </div>
  );
};
