import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import Breadcrumbs from '../../../src/js/rx/components/Breadcrumbs';

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

    expect(tree.props.className).to.equal('rx-breadcrumbs');
  });

  it('should render the basecase correctly', () => {
    const tree = SkinDeep.shallowRender(<Breadcrumbs {...props}/>);
    const lastSpan = tree.everySubTree('span').pop();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Prescription Refills');
  });

  it('should render on prescription detail pages correctly', () => {
    const tree = SkinDeep.shallowRender(<Breadcrumbs {...props} location={{ pathname: 'foo/123' }}/>);
    const lastSpan = tree.everySubTree('span').pop();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('prescriptionName');
  });

  it('should render on glossary page correctly', () => {
    const tree = SkinDeep.shallowRender(<Breadcrumbs {...props} location={{ pathname: 'foo/glossary/' }}/>);
    const lastSpan = tree.everySubTree('span').pop();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Glossary');
  });
});
