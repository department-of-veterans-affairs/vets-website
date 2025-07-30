import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as scroll from 'platform/utilities/scroll';
import { Provider } from 'react-redux';
import {
  CustomTopContent,
  form686cBcList,
  CustomAlertPage,
} from '../../../pages/helpers';
import * as helpers from '../../../helpers';

const TEST_URL = 'https://dev.va.gov/form-upload/21-686c/test-page';

const mockStore = {
  getState: () => ({}),
  subscribe: () => {},
  dispatch: () => {},
};

describe('CustomTopContent', () => {
  beforeEach(() => {
    window.location = new URL(TEST_URL);
  });

  afterEach(() => {
    cleanup();
  });

  const subject = () =>
    render(
      <Provider store={mockStore}>
        <CustomTopContent />
      </Provider>,
    );

  it('renders successfully', () => {
    const { container } = subject();
    expect(container).to.exist;
  });

  it('renders the correct breadcrumbs', () => {
    const { container } = subject();
    const breadcrumbs = $('va-breadcrumbs', container);
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs.getAttribute('breadcrumb-list')).to.equal(
      JSON.stringify(form686cBcList),
    );
  });
});

describe('CustomAlertPage', () => {
  let sandbox;
  let scrollAndFocusStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox
      .stub(helpers, 'getAlert')
      .returns(<div data-testid="mock-alert">Mock Alert</div>);
    scrollAndFocusStub = sandbox.stub(scroll, 'scrollAndFocus');
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  const defaultProps = {
    goBack: sinon.spy(),
    onContinue: sinon.spy(),
    data: { uploadedFile: { name: 'test-file' } },
    contentBeforeButtons: <div data-testid="before">Before</div>,
    contentAfterButtons: <div data-testid="after">After</div>,
    name: 'uploadPage',
    schema: {
      type: 'object',
      properties: {
        dummy: { type: 'string' },
      },
    },
    uiSchema: {},
    formData: {},
    onChange: () => {},
    onSubmit: () => {},
    onError: () => {},
  };

  it('renders the alert and schema form', () => {
    const { getByTestId } = render(<CustomAlertPage {...defaultProps} />);
    expect(getByTestId('mock-alert')).to.exist;
    expect(getByTestId('before')).to.exist;
    expect(getByTestId('after')).to.exist;
  });

  it('calls onClickContinue when Continue clicked', () => {
    const onClickContinueStub = sandbox
      .stub(helpers, 'onClickContinue')
      .callsFake((props, setFn) => setFn(true));

    const { getByRole } = render(<CustomAlertPage {...defaultProps} />);
    const continueBtn = getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn);

    expect(onClickContinueStub.calledOnce).to.be.true;
  });

  it('does not call scrollAndFocus if no va-alert', () => {
    const { getByRole } = render(<CustomAlertPage {...defaultProps} />);
    const continueBtn = getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn);

    expect(scrollAndFocusStub.called).to.be.false;
  });
});
