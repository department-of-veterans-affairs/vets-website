import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { within } from '@testing-library/dom';
import DashboardWidgetWrapper from '../../components/DashboardWidgetWrapper';

describe('<DashboardWidgetWrapper />', () => {
  it('should render', () => {
    const view = render(
      <DashboardWidgetWrapper>
        <div data-testid="test-children" />
      </DashboardWidgetWrapper>,
    );

    const wrapper = view.getByTestId('dashboard-widget-wrapper');

    expect(wrapper).to.exist;
    expect(within(wrapper).getByTestId('test-children')).to.exist;
  });
});
