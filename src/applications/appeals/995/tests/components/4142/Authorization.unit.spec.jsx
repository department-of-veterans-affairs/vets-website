import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Authorization, {
  lastUpdatedIsBeforeCutoff,
} from '../../../components/4142/Authorization';

const createMockStore = (initialState = {}) => ({
  getState: () => initialState,
  subscribe: () => {},
  dispatch: () => {},
});

describe('<Authorization>', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({
      form: {
        loadedData: {
          metadata: {
            lastUpdated: 1640995200, // Unix timestamp
          },
        },
      },
    });
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <Authorization />
      </Provider>,
    );

    const checkbox = $('va-checkbox', container);
    expect(checkbox).to.exist;
  });

  it('should not submit page & show alert error when unchecked', () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { container } = render(
      <Provider store={mockStore}>
        <Authorization goForward={goSpy} setFormData={setFormDataSpy} />
      </Provider>,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: false },
    });

    fireEvent.click($('button.usa-button-primary', container));
    fireEvent.submit($('form', container)); // testing prevent default on form

    // testing onAnchorClick callback - scrolls to & focus on alert
    fireEvent.click($('#checkbox-anchor', container));

    const alert = $('va-alert[visible="true"]', container);
    expect(alert).to.exist;
    expect(goSpy.called).to.be.false;
  });

  it('should update data & submit page when checked', async () => {
    const goSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const data = { privacyAgreementAccepted: true };
    const { container, rerender } = render(
      <Provider store={mockStore}>
        <Authorization
          goForward={goSpy}
          data={{}}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    $('#privacy-agreement', container).__events.vaChange({
      target: { checked: true },
    });

    rerender(
      <Provider store={mockStore}>
        <Authorization
          goForward={goSpy}
          data={data}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    fireEvent.click($('button.usa-button-primary', container));

    await waitFor(() => {
      expect(goSpy.called).to.be.true;
    });
  });

  it('should submit page when checked', () => {
    const goSpy = sinon.spy();
    const data = {
      privacyAgreementAccepted: true,
    };
    const { container } = render(
      <Provider store={mockStore}>
        <Authorization goForward={goSpy} data={data} />
      </Provider>,
    );

    fireEvent.click($('button.usa-button-primary', container));
    expect(goSpy.called).to.be.true;
  });

  describe('lastUpdatedIsBeforeCutoff', () => {
    it('should return true if last updated is before cutoff date', () => {
      const lastUpdated = 1727769600; // '2024-10-01 00:03:00' CST;

      expect(lastUpdatedIsBeforeCutoff(lastUpdated)).to.be.true;
    });

    it('should return true if last updated is before cutoff date', () => {
      const lastUpdated = 1751327400; // '2025-06-30 18:50:00' CST;

      expect(lastUpdatedIsBeforeCutoff(lastUpdated)).to.be.true;
    });

    it('should return false if last updated is after cutoff date', () => {
      const lastUpdated = 1751328060; // '2025-06-30 19:01:00' CST;

      expect(lastUpdatedIsBeforeCutoff(lastUpdated)).to.be.false;
    });

    it('should return false if last updated is exactly the cutoff date', () => {
      const lastUpdated = 1751328000; // '2025-06-30 19:00:00' CST;

      expect(lastUpdatedIsBeforeCutoff(lastUpdated)).to.be.false;
    });
  });
});
