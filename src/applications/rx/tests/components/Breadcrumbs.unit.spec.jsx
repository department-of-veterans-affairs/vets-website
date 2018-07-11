import React from 'react';
import { Link } from 'react-router';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';

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
      <Breadcrumbs {...props} location={{ pathname: 'foo/123' }}>
        {crumbs}
      </Breadcrumbs>
    );
    const lastSpan = tree.everySubTree('Link').pop().subTree();

    expect(lastSpan).to.be.ok;
    expect(lastSpan.text()).to.equal('Prescription Refills');
  });

  // TODO: Remove the test if you feel it's unnessary
  // it('should render on glossary page correctly', () => {
  //   const tree = SkinDeep.shallowRender(<Breadcrumbs {...props} location={{ pathname: 'foo/glossary/' }}/>);
  //   const lastSpan = tree.everySubTree('Link').pop().subTree();
  //   expect(lastSpan).to.be.ok;
  //   expect(lastSpan.text()).to.equal('Prescription Refills');
  // });
});
