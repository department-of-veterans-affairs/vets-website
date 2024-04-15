import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { heading as learnHeading } from '../../components/Learn';
import RatedDisabilityView from '../../components/RatedDisabilityView';

describe('<RatedDisabilityView/>', () => {
  const ratedDisabilities = { ratedDisabilities: [] };
  const fetchRatedDisabilities = sinon.stub();
  const fetchTotalDisabilityRating = sinon.stub();

  it('should render', () => {
    const wrapper = shallow(
      <RatedDisabilityView
        fetchRatedDisabilities={fetchRatedDisabilities}
        fetchTotalDisabilityRating={fetchTotalDisabilityRating}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    expect(
      wrapper
        .find('div')
        .first()
        .exists(),
    ).to.be.true;
    wrapper.unmount();
  });

  it('should display the Learn component', () => {
    const screen = render(
      <RatedDisabilityView
        fetchRatedDisabilities={fetchRatedDisabilities}
        fetchTotalDisabilityRating={fetchTotalDisabilityRating}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    expect(screen.getByText(learnHeading));
  });

  it('should display the NeedHelp component', () => {
    const { container } = render(
      <RatedDisabilityView
        fetchRatedDisabilities={fetchRatedDisabilities}
        fetchTotalDisabilityRating={fetchTotalDisabilityRating}
        ratedDisabilities={ratedDisabilities}
      />,
    );

    expect($('va-need-help', container)).to.exist;
  });
});
