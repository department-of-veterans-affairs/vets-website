import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
// import cloneDeep from 'platform/utilities/data/cloneDeep';

import React, { useState } from 'react';
import {
  VaButton,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ApplicantField from './ApplicantField';

// This is a proof of concept component that enables us to use a standard
// list and loop but with an additional "do you want to add another?" question
// at the end of the flow. This allows the user to enter a single item, THEN
// decide if they want to add another, rather than the standard approach
// where the user must first build the list of items and then go through
// all the pages.

export default function AddAdditionalApplicants({
  goToPath,
  data,
  setFormData,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) {
  const [checkValue, setCheckValue] = useState(undefined);
  // const [tmpState, setTmpState] = useState(undefined);
  const [tmpList, setTmpList] = useState([]);

  const handlers = {
    radioUpdate: ({ detail }) => {
      setCheckValue(detail.value);
      if (detail.value === 'yes') {
        // This lets us add a new list item to the list and loop without
        // going through the "front door" of the pattern. (Questionable practice)
        // const newData = { ...data };
        const newApp = [...tmpList, { backdoorAdd: true }];
        // newData.applicants.push(newApp);
        // setTmpState({ ...newData });
        setTmpList(newApp);
      } else {
        setTmpList([]);
      }
    },

    onGoBack: () => {
      goBack();
    },

    onGoForward: event => {
      event.preventDefault();
      // TODO: implement proper validation before proceeding
      if (checkValue === 'yes') {
        const testVal = { ...data };
        testVal.applicants = [...testVal.applicants, ...tmpList];
        setFormData(testVal); // Commit changes to the actual formdata

        // Technically, we go backward in the form to the first page of this
        // new list item. This lets us start editing a new entry without having
        // to click through all the pages of every other list entry.
        goToPath(
          `/applicant-information/${testVal.applicants.length - 1}/name`,
        );
      } else {
        goForward(data);
      }
    },

    exitLoop: event => {
      event.preventDefault();
      goToPath('/review-and-submit');
    },
  };
  return (
    <>
      <div>
        {data.applicants.map((app, index) => (
          <div key={`app-${index}`}>
            {app?.applicantName && (
              <>
                <ApplicantField formData={app} />
                <VaButton text="Edit" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* TODO: add a header to match the mockup */}
      <label htmlFor="add-another">
        Are there any additional applicants to add?
      </label>
      <>
        <VaRadio
          required
          id="add-another-app"
          name="add-another"
          onVaValueChange={handlers.radioUpdate}
        >
          <va-radio-option
            name="add-yes"
            label="Yes, add another applicant"
            value="yes"
            checked={checkValue === 'yes'}
          />
          <va-radio-option
            name="add-yes"
            label="No, all applicants have been added"
            value="no"
            checked={checkValue === 'no'}
          />
        </VaRadio>

        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons
            goBack={handlers.onGoBack}
            goForward={handlers.onGoForward}
          />
          {contentAfterButtons}
        </div>
      </>
    </>
  );
}
