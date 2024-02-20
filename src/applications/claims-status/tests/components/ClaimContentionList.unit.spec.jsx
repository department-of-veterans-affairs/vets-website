import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import ClaimContentionList, {
  MAX_CONTENTIONS,
} from '../../components/ClaimContentionList';

const mockContentions = [];
for (let i = 0; i < MAX_CONTENTIONS + 1; i += 1) {
  mockContentions.push({ name: `Condition ${i}` });
}

describe('ClaimContentionList', () => {
  it(`renders the first ${MAX_CONTENTIONS} contentions by default`, () => {
    const { queryByText } = render(
      <ClaimContentionList contentions={mockContentions} />,
    );

    expect(queryByText(mockContentions[MAX_CONTENTIONS - 1].name)).to.exist;
    expect(queryByText(mockContentions[MAX_CONTENTIONS].name)).to.not.exist;
  });

  it(`should render a button to show all contentions if there are more than ${MAX_CONTENTIONS}`, () => {
    const { container } = render(
      <ClaimContentionList contentions={mockContentions} />,
    );

    expect($('.show-all-button', container)).to.exist;
  });

  it('renders a message when there are no contentions', () => {
    const { getByText } = render(<ClaimContentionList contentions={[]} />);
    const noContentionsMessage = getByText('Not Available');

    expect(noContentionsMessage).to.exist;
  });
});
