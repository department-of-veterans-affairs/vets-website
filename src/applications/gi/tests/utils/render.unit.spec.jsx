import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { renderLabel } from '../../utils/render';
import { showModal } from '../../actions';

describe('Learn More Label', () => {
  const props = {
    name: 'learn-more-label',
    text: 'learn more',
    modal: 'calcScholarships',
    showModal,
  };
  it('should render', () => {
    const tree = SkinDeep.shallowRender(renderLabel(props));
    const vdom = tree.getRenderOutput();
    const button = tree.subTree('button');
    expect(vdom).to.not.be.undefined;
    expect(button).to.not.be.undefined;
  });
});

describe('Label', () => {
  const props = {
    name: 'learn-more-label',
    text: 'learn more',
  };
  it('should render', () => {
    const tree = SkinDeep.shallowRender(renderLabel(props));
    const vdom = tree.getRenderOutput();
    const button = tree.subTree('button');
    expect(vdom).to.not.be.undefined;
    expect(button).to.equal(false);
  });
});
