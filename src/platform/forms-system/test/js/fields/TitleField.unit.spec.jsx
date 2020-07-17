import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import TitleField from '../../../src/js/fields/TitleField';

describe('Schemaform <TitleField>', () => {
  it('should render legend for root', () => {
    const tree = SkinDeep.shallowRender(
      <TitleField id="root__title" title="foo" />,
    );
    expect(tree.subTree('legend')).not.to.be.false;
  });
  it('should render subtitle for non-root', () => {
    const Foo = <div>Foo</div>;
    const tree = SkinDeep.shallowRender(
      <TitleField id="root_someField" title={<Foo />} />,
    );
    expect(tree.subTree('.schemaform-block-subtitle')).not.to.be.false;
  });
  it('should not render anything if no title is provided', () => {
    const tree = SkinDeep.shallowRender(<TitleField id="root__title" />);
    expect(tree.subTree('TitleField')).to.be.false;
  });
});
