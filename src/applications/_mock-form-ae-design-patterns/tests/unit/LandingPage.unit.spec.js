import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { LandingPage } from '../../shared/components/pages/LandingPage';
import { tabsConfig, getPatterns, getTabs } from '../../utils/data/tabs';

describe('LandingPage Component', () => {
  it('renders the correct title', () => {
    const { getByText } = render(
      <LandingPage
        location={{ pathname: '/mock-form-ae-design-patterns' }}
        year="2024"
        month="June"
        getPatterns={getPatterns}
        getTabs={getTabs}
      />,
    );
    expect(getByText('User Research Study - June 2024')).to.exist;
  });

  it('renders the correct number of tabs for pattern1', () => {
    const { getAllByRole } = render(
      <LandingPage
        location={{ pathname: '/mock-form-ae-design-patterns/1' }}
        year="2024"
        month="June"
        getPatterns={getPatterns}
        getTabs={getTabs}
      />,
    );
    const buttons = getAllByRole('button');
    expect(buttons).to.have.length(tabsConfig.pattern1.length);
  });

  it('renders the correct tab names and descriptions for pattern1', () => {
    const { getByText } = render(
      <LandingPage
        location={{ pathname: '/mock-form-ae-design-patterns/1' }}
        year="2024"
        month="June"
        getPatterns={getPatterns}
        getTabs={getTabs}
      />,
    );
    tabsConfig.pattern1.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
      expect(getByText(tab.description)).to.exist;
    });
  });

  it('renders correctly for pattern2', () => {
    const { getAllByRole, getByText } = render(
      <LandingPage
        location={{ pathname: '/mock-form-ae-design-patterns/2' }}
        year="2024"
        month="June"
        getPatterns={getPatterns}
        getTabs={getTabs}
      />,
    );
    const buttons = getAllByRole('button');
    expect(buttons).to.have.length(tabsConfig.pattern2.length);

    tabsConfig.pattern2.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
      expect(getByText(tab.description)).to.exist;
    });
  });
});
