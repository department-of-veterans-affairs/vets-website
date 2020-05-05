import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { EbenefitsLink } from '../../containers/EbenefitsLink';

describe('EbenefitsLink', () => {
  it('should render with defaults', () => {
    const tree = shallow(<EbenefitsLink>test</EbenefitsLink>);
    expect(tree.find('a').prop('href')).to.equal(
      'https://www.ebenefits.va.gov/',
    );
    expect(tree.find('a').prop('className')).to.equal('');
    expect(tree.find('a').prop('target')).to.equal('_blank');
    expect(tree.find('a').prop('rel')).to.equal('noopener noreferrer');
    expect(tree.find('a').prop('onClick').name).to.equal('click');
    expect(tree.find('a').text()).to.equal('test');
    tree.unmount();
  });

  it('should render with proxy url', () => {
    const tree = shallow(<EbenefitsLink useProxyUrl={'true'} />);
    expect(tree.find('a').prop('href')).to.equal(
      'https://int.eauth.va.gov/ebenefits',
    );
    tree.unmount();
  });

  it('should render with custom onClick', () => {
    const func = () => 'alert';
    const tree = shallow(<EbenefitsLink onClick={func} />);
    expect(tree.find('a').prop('onClick')()).to.equal('alert');
    tree.unmount();
  });

  it('should render with custom href', () => {
    const tree = shallow(<EbenefitsLink href={'https://url'} />);
    expect(tree.find('a').prop('href')).to.equal('https://url');
    tree.unmount();
  });

  it('should render with custom class', () => {
    const tree = shallow(<EbenefitsLink className={'css-class'} />);
    expect(tree.find('a').prop('className')).to.equal('css-class');
    tree.unmount();
  });
});
