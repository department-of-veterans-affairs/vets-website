import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { axeCheck } from '../../helpers/test-helpers';
import PromoBanner, { PROMO_BANNER_TYPES } from './PromoBanner.jsx';

const TEXT =
  'Learn how you can get easier access to health care with the MISSION Act';

describe('<PromoBanner>', () => {
  let defaultProps = null;

  beforeEach(() => {
    defaultProps = {
      type: PROMO_BANNER_TYPES.announcement,
      onClose() {},
      href: 'https://missionact.va.gov/',
      text: TEXT,
    };
  });

  it('should render', () => {
    const tree = shallow(<PromoBanner {...defaultProps} />);
    expect(tree.text()).to.contain(TEXT);
    tree.unmount();
  });

  it('should pass aXe check', () =>
    axeCheck(<PromoBanner {...defaultProps} />));
});
