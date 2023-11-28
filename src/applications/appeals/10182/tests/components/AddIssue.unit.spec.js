import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import AddIssue from '../../components/AddIssue';

describe('<AddIssue>', () => {
  it('should render', () => {
    const { container } = render(
      <div>
        <AddIssue
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
