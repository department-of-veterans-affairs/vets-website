import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { FilterBeforeResults } from '../../../containers/search/FilterBeforeResults'; // adjust the import based on your file structure
import { updateUrlParams } from '../../../selectors/search';
import { mockSearchResults } from '../../helpers';

describe('<FilterBeforeResults />', () => {
  let wrapper;
  let props;

  it('calls correct function on clearAllFilters click', () => {
    props = {
      dispatchShowModal: sinon.spy(),
      dispatchFilterChange: sinon.spy(),
      recordCheckboxEvent: sinon.spy(),
      filters: { excludedSchoolTypes: [] },
      modalClose: sinon.spy(),
      preview: {},
      search: {
        name: { facets: {} },
        location: { facets: {} },
        tab: '',
        query: '',
      },
      smallScreen: false,
      history: [],
      version: 'v1.0.0',
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    const historyMock = {
      push: sinon.spy(),
    };

    updateUrlParams(
      historyMock,
      'someTab',
      'someQuery',
      props.filters,
      props.version,
    );
    expect(historyMock.push.calledOnce).to.be.true;
    wrapper
      .find('button')
      .at(1)
      .simulate('click');
    expect(props.dispatchFilterChange.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('calls recordCheckboxEvent when a checkbox changes', () => {
    props = {
      dispatchShowModal: sinon.spy(),
      dispatchFilterChange: sinon.spy(),
      recordCheckboxEvent: sinon.spy(),
      filters: { excludedSchoolTypes: [] },
      modalClose: sinon.spy(),
      preview: {},
      search: {
        name: { facets: {} },
        location: { facets: {} },
        tab: '',
        query: '',
      },
      smallScreen: false,
      history: [],
      version: 'v1.0.0',
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    const recordCheckboxEventSpy = sinon.spy();
    wrapper.setProps({ recordCheckboxEvent: recordCheckboxEventSpy });

    const event = { target: { name: 'someCheckbox', checked: true } };
    wrapper
      .find('CheckboxGroup')
      .at(0)
      .dive()
      .find('input')
      .at(0)
      .simulate('change', event);

    expect(recordCheckboxEventSpy.calledWith(event)).to.be.false;
    wrapper.unmount();
  });

  it('calls handleIncludedSchoolTypesChange with correct parameters', () => {
    props = {
      dispatchShowModal: sinon.spy(),
      dispatchFilterChange: sinon.spy(),
      recordCheckboxEvent: sinon.spy(),
      filters: { excludedSchoolTypes: [] },
      modalClose: sinon.spy(),
      preview: {},
      search: {
        name: { facets: {} },
        location: { facets: {} },
        tab: '',
        query: '',
      },
      smallScreen: false,
      history: [],
      version: 'v1.0.0',
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    const fakeEvent = { target: { name: 'someSchoolType', checked: true } };
    wrapper
      .find('CheckboxGroup')
      .at(0)
      .dive()
      .find('input')
      .at(0)
      .simulate('change', fakeEvent);

    expect(props.dispatchFilterChange.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('calls dispatchFilterChange and recordCheckboxEvent on checkbox change', () => {
    props = {
      dispatchShowModal: sinon.spy(),
      dispatchFilterChange: sinon.spy(),
      recordCheckboxEvent: sinon.spy(),
      filters: {
        excludedSchoolTypes: [],
        vettec: false,
        preferredProvider: false,
      },
      modalClose: sinon.spy(),
      preview: {},
      search: {
        name: { facets: {} },
        location: { facets: {} },
        tab: '',
        query: '',
      },
      smallScreen: false,
      history: [],
      version: 'v1.0.0',
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    const fakeEvent = {
      target: {
        checked: true,
        name: 'vettec',
        employers: false,
      },
    };

    wrapper
      .find('CheckboxGroup')
      .at(2)
      .simulate('change', fakeEvent);
    expect(props.dispatchFilterChange.calledOnce).to.be.true;
    expect(
      props.dispatchFilterChange.calledWith({
        ...props.filters,
        vettec: true,
        preferredProvider: true,
      }),
    ).to.be.true;
    wrapper
      .find('CheckboxGroup')
      .at(2)
      .simulate('change', {
        target: {
          checked: false,
          name: 'vettec',
        },
      });
    expect(
      props.dispatchFilterChange.calledWith({
        ...props.filters,
        vettec: false,
        preferredProvider: false,
      }),
    ).to.be.true;
    wrapper
      .find('CheckboxGroup')
      .at(2)
      .simulate('change', {
        target: {
          checked: true,
          name: 'employers',
        },
      });
    expect(
      props.dispatchFilterChange.calledWith({
        ...props.filters,
        employers: true,
      }),
    ).to.be.true;

    wrapper
      .find('CheckboxGroup')
      .at(2)
      .simulate('change', {
        target: {
          checked: false,
          name: 'employers',
        },
      });
    expect(
      props.dispatchFilterChange.calledWith({
        ...props.filters,
        employers: false,
      }),
    ).to.be.true;
    expect(props.recordCheckboxEvent.calledOnce).to.be.false;
    expect(props.recordCheckboxEvent.calledWith(fakeEvent)).to.be.false;
    wrapper.unmount();
  });

  it('should render in small screen', () => {
    props = {
      dispatchShowModal: sinon.spy(),
      dispatchFilterChange: sinon.spy(),
      recordCheckboxEvent: sinon.spy(),
      filters: {
        excludedSchoolTypes: [],
        vettec: false,
        preferredProvider: false,
      },
      modalClose: sinon.spy(),
      preview: {},
      search: mockSearchResults,
      smallScreen: true,
      history: [],
      version: 'v1.0.0',
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    expect(wrapper).to.not.be.null;
    wrapper.unmount();
  });
});
