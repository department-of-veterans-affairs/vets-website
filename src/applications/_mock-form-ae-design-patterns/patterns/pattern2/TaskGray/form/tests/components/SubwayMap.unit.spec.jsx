import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import SubwayMap from '../../components/SubwayMap';

describe('<SubwayMap>', () => {
  it('should render', () => {
    const { container } = render(<SubwayMap />);
    expect($('va-process-list', container)).to.exist;
  });
});
