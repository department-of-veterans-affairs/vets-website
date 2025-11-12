import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AddContestableIssue from '../../components/AddContestableIssue';

describe('<AddContestableIssue>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <AddContestableIssue
          setFormData={() => {}}
          data={{}}
          goToPath={() => {}}
          onReviewPage={false}
          testingIndex={null}
          appStateData={{}}
        />
      </div>,
    );
    expect($('h3', container)).to.exist;
    expect($('va-text-input', container)).to.exist;
    expect($('va-memorable-date', container)).to.exist;
  });
});
