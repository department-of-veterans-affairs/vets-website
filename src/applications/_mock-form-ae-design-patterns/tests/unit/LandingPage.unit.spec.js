import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { LandingPage } from '../../shared/components/pages/LandingPage';
import { tabsConfig } from '../../utils/data/tabs';

describe('LandingPage Component', () => {
  it('renders the correct title', () => {
    const { getByText } = render(<LandingPage />);
    expect(getByText('User Research Study - Aug/Sep 2024')).to.exist;
  });

  it('renders the correct number of tabs for pattern1', () => {
    const { getAllByRole } = render(
      <LandingPage location={{ pathname: '/1' }} />,
    );
    const buttons = getAllByRole('button');
    expect(buttons).to.have.length(tabsConfig.pattern1.length);
  });

  it('renders the correct tab names and descriptions for pattern1', () => {
    const { getByText } = render(<LandingPage location={{ pathname: '/1' }} />);
    tabsConfig.pattern1.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
      expect(getByText(tab.description)).to.exist;
    });
  });

  it('applies the correct base class to each button for pattern1', () => {
    const { getByText } = render(<LandingPage location={{ pathname: '/1' }} />);
    tabsConfig.pattern1.forEach(tab => {
      const button = getByText(tab.name);
      const baseClasses = tab.baseClass.split(' ');
      baseClasses.forEach(className => {
        expect(button.classList.contains(className)).to.be.true;
      });
    });
  });

  it('renders correctly for pattern2', () => {
    const { getAllByRole, getByText } = render(
      <LandingPage location={{ pathname: '/2' }} />,
    );
    const buttons = getAllByRole('button');
    expect(buttons).to.have.length(tabsConfig.pattern2.length);

    tabsConfig.pattern2.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
      expect(getByText(tab.description)).to.exist;
    });
  });
});
