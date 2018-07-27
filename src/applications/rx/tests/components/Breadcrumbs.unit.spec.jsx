import React from 'react';
import { Link } from 'react-router';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import RxBreadcrumbs from '../../components/Breadcrumbs';

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

const crumbs = [
  <a href="/" key="home">Home</a>,
  <a href="/health-care/" key="healthcare">Health Care</a>,
  <Link to="/" key="prescriptions">Prescription Refills</Link>
];

describe('<Breadcrumbs>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<RxBreadcrumbs {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render on prescription refills page correctly', () => {
    const tree = SkinDeep.shallowRender(
      <RxBreadcrumbs {...props}>
        {crumbs}
      </RxBreadcrumbs>
    );
    const lastSpan = tree.everySubTree('Link').pop().subTree();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Prescription Refills');
  });

  it('should render on prescription detail pages correctly', () => {
    const tree = SkinDeep.shallowRender(
      <RxBreadcrumbs {...props} location={{ pathname: 'foo/123' }}>
        {crumbs}
      </RxBreadcrumbs>
    );
    const lastSpan = tree.everySubTree('Link').pop().subTree();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Prescription Details');
  });

  it('should render on glossary page correctly', () => {
    const tree = SkinDeep.shallowRender(<RxBreadcrumbs {...props} location={{ pathname: 'foo/glossary/' }}/>);
    const lastSpan = tree.everySubTree('Link').pop().subTree();
    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Glossary');
  });

  it('should render on settings page correctly', () => {
    const tree = SkinDeep.shallowRender(<RxBreadcrumbs {...props} location={{ pathname: 'foo/settings/' }}/>);
    const lastSpan = tree.everySubTree('Link').pop().subTree();
    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Settings');
  });
});
