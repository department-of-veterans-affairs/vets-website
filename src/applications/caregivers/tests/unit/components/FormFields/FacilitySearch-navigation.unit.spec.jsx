import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon-v20';
import { Provider } from 'react-redux';
import FacilitySearch, {
  REVIEW_PATHS,
} from '../../../../components/FormFields/FacilitySearch';
import { inputVaSearchInput } from '../../../test-helpers';

describe('CG <FacilitySearch>', () => {
  const mockStore = {
    getState: () => {},
    subscribe: () => {},
    dispatch: () => {},
  };
  let goBack;
  let goForward;
  let goToPath;

  const subject = ({ data = {} } = {}) => {
    const props = { data, goBack, goForward, goToPath };
    const { container, getByText, queryByRole } = render(
      <Provider store={mockStore}>
        <FacilitySearch {...props} />
      </Provider>,
    );
    const selectors = () => ({
      backBtn: getByText('Back'),
      continueBtn: queryByRole('button', { name: /Continue/i }),
      searchInputError: queryByRole('alert'),
    });
    return { container, selectors, getByText };
  };

  beforeEach(() => {
    goBack = sinon.spy();
    goForward = sinon.spy();
    goToPath = sinon.spy();
  });

  afterEach(() => {
    goBack.resetHistory();
    goForward.resetHistory();
    goToPath.resetHistory();
  });

  context('when review query is `false`', () => {
    it('should call `goBack` when the back button is clicked', () => {
      const { selectors } = subject();
      const { backBtn } = selectors();
      userEvent.click(backBtn);
      sinon.assert.calledOnce(goBack);
    });

    it('should call `goForward` when the continue button is clicked after selecting facility', () => {
      const { selectors } = subject({
        data: {
          'view:plannedClinic': { caregiverSupport: { id: 'my id' } },
        },
      });
      const { continueBtn } = selectors();
      userEvent.click(continueBtn);
      sinon.assert.calledOnce(goForward);
    });

    it('should not call `goForward` when the continue button is clicked before submitting search', () => {
      const { container, selectors } = subject();
      const { continueBtn } = selectors();
      inputVaSearchInput({ container, query: 'Tampa', submit: false });
      userEvent.click(continueBtn);
      sinon.assert.notCalled(goForward);
    });

    it('should not call `goForward` when the continue button is clicked before seach input interaction', () => {
      const { selectors } = subject();
      const { continueBtn } = selectors();
      userEvent.click(continueBtn);
      sinon.assert.notCalled(goForward);
    });
  });

  context('when review query is `true`', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { search: '?review=true' },
        configurable: true,
      });
    });

    it('should call `goToPath` with the correct page route when the back button is clicked', () => {
      const { selectors } = subject();
      const { backBtn } = selectors();
      userEvent.click(backBtn);
      sinon.assert.calledWithExactly(goToPath, REVIEW_PATHS.reviewAndSubmit);
    });

    it('should call `goToPath` with the correct page route when selected facility has support services', () => {
      const { selectors } = subject({
        data: {
          'view:plannedClinic': {
            caregiverSupport: { id: 'my id' },
            veteranSelected: { id: 'my id' },
          },
        },
      });
      const { continueBtn } = selectors();
      userEvent.click(continueBtn);
      sinon.assert.calledWithExactly(goToPath, REVIEW_PATHS.reviewAndSubmit);
    });

    it('should call `goToPath` with the correct page route when selected facility does not have support services', () => {
      const { selectors } = subject({
        data: {
          'view:plannedClinic': {
            caregiverSupport: { id: 'my id' },
            veteranSelected: { id: 'other id' },
          },
        },
      });
      const { continueBtn } = selectors();
      userEvent.click(continueBtn);
      sinon.assert.calledWithExactly(goToPath, REVIEW_PATHS.confirmFacility);
    });
  });
});
