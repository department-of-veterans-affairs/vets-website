import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import HelpBlock from '../HelpBlock';

describe('<HelpBlock />', () => {
  const initState = {
    app: 'dayOf',
    features: {
      // eslint-disable-next-line camelcase
      check_in_experience_45_minute_reminder: true,
    },
  };

  it('renders correctly without the travel block when travel prop is false or undefined', () => {
    const component = render(
      <CheckInProvider
        store={initState}
        router={{ currentPage: 'contact-information' }}
      >
        <HelpBlock />
      </CheckInProvider>,
    );

    expect(component.getByTestId('for-help-using-this-tool')).to.exist;
    expect(component.getByTestId('if-you-have-questions')).to.exist;
    expect(component.getByTestId('if-yourre-in-crisis')).to.exist;
    expect(component.getByTestId('if-you-think-your-life-is-in-danger')).to
      .exist;

    // These elements should NOT be present when travel is false
    expect(component.queryByTestId('for-questions-about-filing')).to.not.exist;
  });

  it('renders correctly with the travel block when travel prop is true', () => {
    const component = render(
      <CheckInProvider
        store={initState}
        router={{ currentPage: 'contact-information' }}
      >
        <HelpBlock travelClaim />
      </CheckInProvider>,
    );

    expect(component.queryByTestId('for-help-using-this-tool')).to.not.exist;
    expect(component.getByTestId('if-you-have-questions')).to.exist;
    expect(component.getByTestId('for-questions-about-filing')).to.exist;
    expect(component.getByTestId('if-yourre-in-crisis')).to.exist;
    expect(component.getByTestId('if-you-think-your-life-is-in-danger')).to
      .exist;
  });
});
