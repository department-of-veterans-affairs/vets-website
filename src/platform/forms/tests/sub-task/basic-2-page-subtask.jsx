import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Start = ({ data = {}, error, setPageData }) => {
  const setAnswer = event => {
    setPageData({ choice: event.detail.value || null });
  };
  return (
    <>
      <h1 className="vads-u-margin-bottom--0">Start Page</h1>
      <div className="schemaform-subtitle vads-u-font-size--lg">
        VA Form XX-1234
      </div>
      <VaRadio
        label="choose yes or no?"
        error={error ? 'You must choose yes or no' : null}
        onVaValueChange={setAnswer}
        required
        label-header-level="2"
      >
        <VaRadioOption
          key="yes"
          name="start"
          id="yes"
          value="yes"
          label="Yes"
          checked={data.choice === 'yes'}
        />
        <VaRadioOption
          key="no"
          name="start"
          id="no"
          value="no"
          label="No"
          checked={data.choice === 'no'}
        />
      </VaRadio>
    </>
  );
};

const End = () => (
  <>
    <h1 className="vads-u-margin-bottom--0">End Page</h1>
    <div className="schemaform-subtitle vads-u-font-size--lg">
      VA Form XX-1234
    </div>
    <div id="done">Done</div>
  </>
);

export default [
  {
    name: 'start',
    component: Start,
    validate: ({ choice } = {}) => ['yes', 'no'].includes(choice),
    back: null,
    next: ({ choice }) => (choice === 'yes' ? '/chose-yes' : 'end'),
  },
  {
    name: 'end',
    component: End,
    next: null,
    back: 'start',
  },
];
