import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { IntroductionPage } from '../containers/IntroductionPage';

const getData = ({ canUpload1010cgPOA = true } = {}) => ({
  mockProps: {
    router: [],
    route: { formConfig: {} },
    formData: {},
    setFormData: () => {},
    canUpload1010cgPOA,
  },
  mockStore: {
    getState: () => ({
      featureToggles: {
        canUpload1010cgPOA,
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: {
          get() {},
        },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render poa note', () => {
    const { mockProps, mockStore } = getData({ canUpload1010cgPOA: true });
    const tree = mount(
      <Provider store={mockStore}>
        <IntroductionPage {...mockProps} />,
      </Provider>,
    );

    expect(tree.find('[data-testid="poa-info-note"]').exists()).to.be.true;
    tree.unmount();
  });

  it('should not render poa note', () => {
    const { mockProps, mockStore } = getData({ canUpload1010cgPOA: false });
    const tree = mount(
      <Provider store={mockStore}>
        <IntroductionPage {...mockProps} />,
      </Provider>,
    );

    expect(tree.find('[data-testid="poa-info-note"]').exists()).to.be.false;
    tree.unmount();
  });
});
