import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import CompareHeader from '../../components/CompareHeader';

describe('<CompareHeader>', () => {
  it('should render', () => {
    const tree = shallow(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
        />
      </BrowserRouter>,
    );
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should have div with card-wrappe class', () => {
    const tree = mount(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
          smallScreen
        />
      </BrowserRouter>,
    );
    expect(tree.find('div.card-wrapper').text()).to.equal(
      'Test Institution ARemoveTest Institution BRemoveReturn to search to add',
    );
    tree.unmount();
  });

  it('should not have div with card-wrappe class', () => {
    const tree = mount(
      <BrowserRouter>
        <CompareHeader
          institutions={[
            {
              name: 'Test Institution A',
            },
            {
              name: 'Test Institution B',
            },
          ]}
          smallScreen={false}
        />
      </BrowserRouter>,
    );
    expect(tree.find('div.card-wrapper')).to.not.be.true;
    tree.unmount();
  });

  it('should call setShowDifferences and recordEvent when Checkbox is changed', () => {
    const setShowDifferences = sinon.spy();
    const recordEvent = sinon.spy();

    const wrapper = shallow(
      <CompareHeader
        setShowDifferences={setShowDifferences}
        recordEvent={recordEvent}
        institutions={[
          {
            name: 'Test Institution A',
          },
          {
            name: 'Test Institution B',
          },
        ]}
      />,
    );

    wrapper.find('Checkbox').simulate('change', { target: { checked: true } });

    expect(setShowDifferences.calledOnce).to.be.true;
    expect(setShowDifferences.calledWith(true)).to.be.true;
    expect(recordEvent.calledOnce).to.be.false;
    expect(
      recordEvent.calledWith({
        event: 'gibct-form-change',
        'gibct-form-field': 'Highlight differences',
        'gibct-form-value': true,
      }),
    ).to.be.false;
    wrapper.unmount();
  });
  it('should call setPromptingFacilityCode when Remove button is clicked', () => {
    const setPromptingFacilityCode = sinon.spy();
    const institution = {
      facilityCode: '12345',
      name: 'Example Institution',
    };

    const wrapper = shallow(
      <CompareHeader
        setPromptingFacilityCode={setPromptingFacilityCode}
        institutions={[
          {
            name: 'Test Institution A',
          },
          {
            name: 'Test Institution B',
          },
        ]}
      />,
    );

    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    expect(setPromptingFacilityCode.calledOnce).to.be.true;
    expect(setPromptingFacilityCode.calledWith(institution.facilityCode)).to.be
      .false;
    wrapper.unmount();
  });
  it('appends version to the URL when version is provided', () => {
    const institutions = [{ facilityCode: '123' }];
    const version = '456';
    const wrapper = shallow(
      <CompareHeader institutions={institutions} version={version} />,
    );

    const link = wrapper.find('Link').at(0);
    const linkProps = link.prop('to');
    expect(linkProps.pathname).to.equal(`/institution/123?version=456`);
    wrapper.unmount();
  });
});
