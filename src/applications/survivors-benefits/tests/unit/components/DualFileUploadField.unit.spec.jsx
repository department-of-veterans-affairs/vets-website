import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, cleanup } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DualFileUploadField from '../../../components/DualFileUploadField';

// ---------------------------------------------------------------------------
// Store factory
// The component reads featureToggles.survivorsBenefitsIdp via useSelector.
// ---------------------------------------------------------------------------
const makeStore = (caveEnabled = false) =>
  createStore(() => ({
    form: { data: { files: [] } },
    featureToggles: { survivorsBenefitsIdp: caveEnabled },
  }));

// ---------------------------------------------------------------------------
// Props factory
// vaFileInputFieldMapping → commonFieldMapping reads:
//   childrenProps.schema.maxLength / minLength / pattern
//   childrenProps.idSchema.$id
// formsPatternFieldMapping reads uiOptions (handled with {})
// ---------------------------------------------------------------------------
const makeProps = (overrides = {}) => ({
  label: 'Upload files',
  required: false,
  error: null,
  textDescription: null,
  uiOptions: {},
  childrenProps: {
    formData: [],
    onChange: sinon.spy(),
    onBlur: sinon.spy(),
    schema: {},
    idSchema: { $id: 'root_files' },
    uiSchema: {},
  },
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('<DualFileUploadField />', () => {
  afterEach(cleanup);

  const render_ = (props = makeProps(), caveEnabled = false) =>
    render(
      <Provider store={makeStore(caveEnabled)}>
        <DualFileUploadField {...props} />
      </Provider>,
    );

  it('renders without crashing with minimal props', () => {
    const { container } = render_();
    expect(container).to.exist;
  });

  it('renders a va-file-input-multiple element', () => {
    const { container } = render_();
    expect(container.querySelector('va-file-input-multiple')).to.exist;
  });

  it('renders with caveEnabled feature flag set to true', () => {
    const { container } = render_(makeProps(), true);
    expect(container.querySelector('va-file-input-multiple')).to.exist;
  });

  it('accepts a pre-populated formData array without crashing', () => {
    const props = makeProps({
      childrenProps: {
        formData: [{ name: 'dd214.pdf', size: 1234 }],
        onChange: sinon.spy(),
        onBlur: sinon.spy(),
        schema: {},
        idSchema: { $id: 'root_files' },
        uiSchema: {},
      },
    });
    const { container } = render_(props);
    expect(container.querySelector('va-file-input-multiple')).to.exist;
  });
});
