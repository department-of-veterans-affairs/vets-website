import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CompareGrid from '../../components/CompareGrid';

describe('<CompareGrid>', () => {
  it('should render', () => {
    const tree = shallow(<CompareGrid institutions={[]} fieldData={[]} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should render', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[
          {
            name: 'Institution A',
            testValue: 'AAA',
          },
          {
            name: 'Institution B',
            testValue: 'BBB',
          },
        ]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
      />,
    );
    expect(tree.find('.field-label').length).to.eq(1);
    expect(tree.find('.field-value').length).to.eq(2);
    expect(tree.find('.field-label').text()).to.eq('Test Field');
    expect(
      tree
        .find('.field-value')
        .at(0)
        .text(),
    ).to.eq('AAA');
    expect(
      tree
        .find('.field-value')
        .at(1)
        .text(),
    ).to.eq('BBB');
    tree.unmount();
  });

  it('should render', () => {
    const tree = shallow(<CompareGrid institutions={[]} fieldData={[]} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });

  it('should add small-screen:vads-l-col--4 class when institution.length = 3 and smallScreen is false', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[
          {
            name: 'Institution A',
            testValue: 'AAA',
          },
          {
            name: 'Institution B',
            testValue: 'BBB',
          },
          {
            name: 'Institution C',
            testValue: 'CCC',
          },
        ]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
        smallScreen
      />,
    );
    expect(tree.find('div.field-label').text()).to.eql('Test Field');
    tree.unmount();
  });

  it('should add small-screen:vads-l-col--12 class if institution.length = 2 & smallScreen is false', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[
          {
            name: 'Institution C',
            testValue: 'CCC',
          },
        ]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
        smallScreen
      />,
    );
    expect(tree.find('div.field-label').text()).to.eql('Test Field');
    tree.unmount();
  });

  it('should add has-diff class if institution.length = 0 & smallScreen is false', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
        smallScreen
      />,
    );
    expect(tree.find('div.field-label').text()).to.eql('Test Field');
    tree.unmount();
  });
  it('should render section label and sub section label', () => {
    const tree = shallow(
      <CompareGrid
        institutions={[]}
        fieldData={[
          {
            label: 'Test Field',
            mapper: institution => institution.testValue,
          },
        ]}
        smallScreen
        sectionLabel="Test Section"
        subSectionLabel="Test Sub Section"
      />,
    );
    expect(tree.find('h2').text()).to.equal('Test Section');
    expect(tree.find('h3').text()).to.equal('Test Sub Section');
    tree.unmount();
  });
});
