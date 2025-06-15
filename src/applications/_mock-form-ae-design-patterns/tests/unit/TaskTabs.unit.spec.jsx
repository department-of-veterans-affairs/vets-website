import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { TaskTabs } from '../../shared/components/TaskTabs';
import { tabsConfig } from '../../utils/data/tabs';

describe('TaskTabs Component', () => {
  const mockFormConfig = {
    rootUrl: '/mock-form-ae-design-patterns',
  };

  it('renders correct tabs for pattern1', () => {
    const mockLocation = {
      pathname: '/1/task-green',
    };

    const { getByText, getAllByRole } = render(
      <TaskTabs location={mockLocation} formConfig={mockFormConfig} />,
    );

    expect(getByText('Home')).to.exist;

    tabsConfig.pattern1.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
    });

    const tabElements = getAllByRole('listitem');
    expect(tabElements).to.have.length(tabsConfig.pattern1.length + 1);

    const greenTaskTab = getByText('Green Task');
    expect(greenTaskTab.closest('li')).to.have.class(
      'vads-u-font-weight--bold',
    );
  });

  it('renders correct tabs for pattern2', () => {
    const mockLocation = {
      pathname: '/2/task-gray',
    };

    const { getByText, getAllByRole } = render(
      <TaskTabs location={mockLocation} formConfig={mockFormConfig} />,
    );

    expect(getByText('Home')).to.exist;

    tabsConfig.pattern2.forEach(tab => {
      expect(getByText(tab.name)).to.exist;
    });

    const tabElements = getAllByRole('listitem');
    expect(tabElements).to.have.length(tabsConfig.pattern2.length + 1);

    const activeTab = getByText('Gray');
    expect(activeTab.closest('li')).to.have.class('vads-u-font-weight--bold');
  });

  it('applies correct classes to active and inactive tabs', () => {
    const mockLocation = {
      pathname: '/1/task-yellow',
    };

    const { getByText } = render(
      <TaskTabs location={mockLocation} formConfig={mockFormConfig} />,
    );

    const activeTab = getByText('Yellow Task');
    const inactiveTab = getByText('Green Task');

    expect(activeTab.closest('li')).to.have.class('vads-u-font-weight--bold');
    expect(inactiveTab.closest('li')).to.not.have.class(
      'vads-u-font-weight--bold',
    );
  });

  it('generates correct href for Home tab', () => {
    const mockLocation = {
      pathname: '/1/task-green',
    };

    const { getByText } = render(
      <TaskTabs location={mockLocation} formConfig={mockFormConfig} />,
    );

    const homeTab = getByText('Home');
    expect(homeTab.getAttribute('href')).to.equal(
      '/mock-form-ae-design-patterns/1',
    );
  });

  it('generates correct href for other tabs', () => {
    const mockLocation = {
      pathname: '/1/task-green',
    };

    const { getByText } = render(
      <TaskTabs location={mockLocation} formConfig={mockFormConfig} />,
    );

    const yellowTab = getByText('Yellow Task');
    expect(yellowTab.getAttribute('href')).to.equal(
      '/mock-form-ae-design-patterns/1/task-yellow',
    );
  });
});
