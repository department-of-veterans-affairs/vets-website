import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ClaimContentionList, {
  MAX_CONTENTIONS,
} from '../../components/ClaimContentionList';

describe('ClaimContentionList', () => {
  it('renders the first MAX_CONTENTIONS amount of contentions by default', () => {
    const contentions = [];
    for (let i = 0; i < MAX_CONTENTIONS + 1; i += 1) {
      contentions.push({ name: `Contention ${i}` });
    }
    const { queryByText } = render(
      <ClaimContentionList contentions={contentions} />,
    );

    expect(queryByText(contentions[MAX_CONTENTIONS - 1].name)).to.exist;
    expect(queryByText(contentions[MAX_CONTENTIONS].name)).to.not.exist;
  });

  it('should render a button to show all contentions if there are more than MAX_CONTENTIONS', () => {
    const contentions = [];
    for (let i = 0; i < MAX_CONTENTIONS + 1; i += 1) {
      contentions.push({ name: `Contention ${i}` });
    }

    const { container } = render(
      <ClaimContentionList contentions={contentions} />,
    );

    expect($('.show-all-button', container)).to.exist;
  });

  it('renders a message when there are no contentions', () => {
    const { getByText } = render(<ClaimContentionList contentions={[]} />);
    const noContentionsMessage = getByText('Not Available');

    expect(noContentionsMessage).to.exist;
  });
});
