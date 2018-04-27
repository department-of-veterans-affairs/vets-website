import React from 'react';
import { Link } from 'react-router';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Breadcrumbs from '../../../../platform/utilities/ui/Breadcrumbs';

const props = {
  location: {
    pathname: 'path',
  },
  prescription: {
    rx: {
      attributes: {
        prescriptionName: 'prescriptionName',
      }
    }
  }
};

describe('<Breadcrumbs>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Breadcrumbs {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should have the expected classname', () => {
    const tree = SkinDeep.shallowRender(<Breadcrumbs {...props}/>);

    expect(tree.props.className).to.equal('va-nav-breadcrumbs');
  });

  it('should render on prescription detail pages correctly', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs {...props}>
        <Link to="foo/123/">Prescription 123</Link>
      </Breadcrumbs>
    );
    const lastSpan = tree.everySubTree('Link').pop().subTree();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Prescription 123');
  });

  it('should render on glossary page correctly', () => {
    const tree = SkinDeep.shallowRender(
      <Breadcrumbs {...props}>
        <Link to="foo/glossary/">Glossary</Link>
      </Breadcrumbs>
    );
    const lastSpan = tree.everySubTree('Link').pop().subTree();
    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Glossary');
  });
});
