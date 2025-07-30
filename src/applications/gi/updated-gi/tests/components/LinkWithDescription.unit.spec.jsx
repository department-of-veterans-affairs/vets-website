import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as featureToggles from 'platform/utilities/feature-toggles';
import LinkWithDescription from '../../components/LinkWithDescription';

describe('<HomePage />', () => {
  let useFeatureToggleStub;

  beforeEach(() => {
    useFeatureToggleStub = sinon.stub(featureToggles, 'useFeatureToggle');
  });

  it('Link should display when feature toggle is enabled', () => {
    useFeatureToggleStub.returns(true);

    const { getByTestId } = render(<LinkWithDescription />);
    expect(getByTestId('comparison-tool-link')).to.exist;
  });
});
