import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { FilterBeforeResults } from '../../../containers/search/FilterBeforeResults';
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
      errorReducer: { error: null },
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
    wrapper.find('[testId="clear-button"]').simulate('click');
    expect(props.dispatchFilterChange.calledOnce).to.be.false;
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
      errorReducer: { error: null },
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
      errorReducer: { error: null },
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
      errorReducer: { error: null },
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
      errorReducer: { error: null },
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    expect(wrapper).to.not.be.null;
    wrapper.unmount();
  });
  it('should render in VaLoadingIndicator in smallscreen', () => {
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
      search: { ...mockSearchResults, inProgress: true },
      smallScreen: true,
      history: [],
      version: 'v1.0.0',
      errorReducer: { error: null },
    };
    wrapper = shallow(<FilterBeforeResults {...props} />);
    expect(wrapper.find('VaLoadingIndicator')).to.exist;
    wrapper.unmount();
  });
  describe('should render', () => {
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
        inProgres: false,
        location: { facets: {} },
        name: { facets: {} },
        tab: '',
        query: '',
      },
      smallScreen: false,
      history: [],
      version: 'v1.0.0',
      errorReducer: { error: null },
    };
    beforeEach(() => {
      global.window.buildType = true;
    });
    it('should render', () => {
      wrapper = shallow(<FilterBeforeResults {...props} />);
      expect(
        wrapper
          .find('label')
          .someWhere(n => n.text() === 'Native American-serving institutions'),
      ).to.be.false;
      wrapper.unmount();
    });
    it('calls dispatchFilterChange with the correct parameters on clearAllFilters', async () => {
      const mockDispatchFilterChange = sinon.spy();
      props = {
        smallScreen: false,
        dispatchFilterChange: mockDispatchFilterChange,
        dispatchShowModal: sinon.spy(),
        recordCheckboxEvent: sinon.spy(),
        filters: {
          excludedSchoolTypes: [],
          vettec: false,
          preferredProvider: false,
        },
        modalClose: sinon.spy(),
        preview: {},
        search: {
          inProgres: true,
          location: { facets: {} },
          name: { facets: {} },
          tab: '',
          query: '',
        },
        history: [],
        version: 'v1.0.0',
        errorReducer: { error: null },
      };
      wrapper = mount(<FilterBeforeResults {...props} />);
      wrapper.find('button.clear-filters-button').simulate('click');
      const expectedDispatchArgument = {
        accredited: false,
        country: 'ALL',
        employers: false,
        excludeCautionFlags: false,
        excludedSchoolTypes: [],
        preferredProvider: false,
        schools: false,
        specialMissionAANAPII: false,
        specialMissionANNHI: false,
        specialMissionHSI: false,
        specialMissionHbcu: false,
        specialMissionMenonly: false,
        specialMissionNANTI: false,
        specialMissionPBI: false,
        specialMissionRelaffil: false,
        specialMissionTRIBAL: false,
        specialMissionWomenonly: false,
        state: 'ALL',
        studentVeteran: false,
        vettec: false,
        yellowRibbonScholarship: false,
      };
      await waitFor(() => {
        sinon.assert.calledOnce(mockDispatchFilterChange);
        sinon.assert.calledWith(
          mockDispatchFilterChange,
          expectedDispatchArgument,
        );
      });

      wrapper.unmount();
    });
  });
});
