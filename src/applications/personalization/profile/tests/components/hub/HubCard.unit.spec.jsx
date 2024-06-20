import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { HubCard } from '../../../components/hub/HubCard';

describe('<HubCard />', () => {
  it('should render the correct heading', () => {
    const { getByText } = render(
      <HubCard heading="Test Heading" content="Test Content" />,
    );

    expect(getByText('Test Heading')).to.exist;
  });

  it('should render the correct content', () => {
    const { getByText } = render(
      <HubCard heading="Test Heading" content="Test Content" />,
    );

    expect(getByText('Test Content')).to.exist;
  });

  it('should render children when passed in', () => {
    const { getByText } = render(
      <HubCard heading="Test Heading" content="Test Content">
        <div>Child Component</div>
      </HubCard>,
    );

    expect(getByText('Child Component')).to.exist;
  });
});
