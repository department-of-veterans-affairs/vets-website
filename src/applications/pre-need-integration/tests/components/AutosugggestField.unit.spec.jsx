// import React from 'react';
// import { expect } from 'chai';
// import { mount } from 'enzyme';
// import configureStore from 'redux-mock-store';
// import { Provider } from 'react-redux';
// import sinon from 'sinon';
// import AutosuggestField from '../../components/AutosugggestField'; // Adjust the import path as needed

// describe('AutosuggestField', () => {
//   const mockStore = configureStore([]);
//   const store = mockStore({});
//   const defaultProps = {
//     schema: {
//       enum: ['option1', 'option2'],
//       enumNames: ['Option 1', 'Option 2'],
//     },
//     uiSchema: {
//       'ui:options': {
//         labels: {
//           option1: 'Option 1',
//           option2: 'Option 2',
//         },
//         debounceRate: 0,
//         maxOptions: 10,
//         queryForResults: false,
//         freeInput: false,
//       },
//     },
//     formData: '',
//     idSchema: { $id: 'test-id' },
//     onChange: sinon.spy(),
//     onBlur: sinon.spy(),
//     formContext: { reviewMode: false },
//   };

//   let wrapper;

//   afterEach(() => {
//     if (wrapper) {
//       wrapper.unmount();
//     }
//   });

//   it('renders without crashing', () => {
//     wrapper = mount(
//       <Provider store={store}>
//         <AutosuggestField {...defaultProps} />
//       </Provider>,
//     );
//     expect(wrapper.find('input')).to.have.lengthOf(1);
//     wrapper.unmount();
//   });

//   it('displays suggestions when typing', () => {
//     wrapper = mount(
//       <Provider store={store}>
//         <AutosuggestField {...defaultProps} />
//       </Provider>,
//     );
//     const input = wrapper.find('input');
//     input.simulate('change', { target: { value: 'Option' } });
//     expect(wrapper.find('.autosuggest-item')).to.have.lengthOf(2);
//     wrapper.unmount();
//   });

//   it('calls onChange when a suggestion is selected', () => {
//     wrapper = mount(
//       <Provider store={store}>
//         <AutosuggestField {...defaultProps} />
//       </Provider>,
//     );
//     const input = wrapper.find('input');
//     input.simulate('change', { target: { value: 'Option' } });
//     const option = wrapper.find('.autosuggest-item').at(0);
//     option.simulate('click');
//     expect(defaultProps.onChange.calledWith('option1')).to.be.true;
//     wrapper.unmount();
//   });

//   it('clears input when escape key is pressed', () => {
//     wrapper = mount(
//       <Provider store={store}>
//         <AutosuggestField {...defaultProps} />
//       </Provider>,
//     );
//     const input = wrapper.find('input');
//     input.simulate('change', { target: { value: 'Option' } });
//     input.simulate('keydown', { keyCode: 27 });
//     expect(input.instance().value).to.equal('');
//     wrapper.unmount();
//   });

//   it('calls onBlur when input loses focus', () => {
//     wrapper = mount(
//       <Provider store={store}>
//         <AutosuggestField {...defaultProps} />
//       </Provider>,
//     );
//     const input = wrapper.find('input');
//     input.simulate('blur');
//     expect(defaultProps.onBlur.calledWith('test-id')).to.be.true;
//     wrapper.unmount();
//   });
// });
