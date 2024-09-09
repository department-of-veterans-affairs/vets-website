import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import * as SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import IntroductionPage from '../../../containers/IntroductionPage';
import { formConfig1 } from '../../../_config/formConfig';

describe('<IntroductionPage /> component', () => {
  // React Testing Library does not currently want to render the
  // SaveInProgressIntro component.
  beforeEach(() => sinon.stub(SaveInProgressIntro, 'default').value('div'));

  it('renders OMB info from props', () => {
    const ombInfo = {
      expDate: '8/29/2025',
      ombNumber: '1212-1212',
      resBurden: 30,
    };

    const screen = render(
      <IntroductionPage
        ombInfo={ombInfo}
        route={{
          formConfig: formConfig1,
          pageList: [],
        }}
      />,
    );

    const vaOmbInfo = screen.getByTestId('va-omb-info');

    expect(vaOmbInfo).to.have.attribute(
      'res-burden',
      ombInfo.resBurden.toString(),
    );
    expect(vaOmbInfo).to.have.attribute('omb-number', ombInfo.ombNumber);
    expect(vaOmbInfo).to.have.attribute('exp-date', ombInfo.expDate);
  });
});
