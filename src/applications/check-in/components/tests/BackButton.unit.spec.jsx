import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import BackButton from '../BackButton';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('BackButton', () => {
    const store = {
      formPages: ['verify', 'second-page', 'third-page', 'fourth-page'],
    };
    const mockRouterThirdPage = {
      currentPage: '/third-page',
    };
    it('Renders', () => {
      const goBack = sinon.spy();
      const screen = render(
        <CheckInProvider store={store} router={mockRouterThirdPage}>
          <BackButton action={goBack} />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('back-button')).to.exist;
      expect(screen.getByTestId('back-button')).to.have.text(
        'Back to last screen',
      );
    });
    it('click fires router goBack', () => {
      const goBack = sinon.spy();
      const screen = render(
        <CheckInProvider store={store} router={mockRouterThirdPage}>
          <BackButton action={goBack} />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('back-button')).to.exist;
      fireEvent.click(screen.getByTestId('back-button'));
      expect(goBack.calledOnce).to.be.true;
    });
    it("doesn't render if it is the first confirmation", () => {
      const mockRouterSecondPage = {
        currentPage: '/second-page',
      };
      const goBack = sinon.spy();
      const screen = render(
        <CheckInProvider store={store} router={mockRouterSecondPage}>
          <BackButton action={goBack} />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('back-button')).to.not.exist;
    });
    it('renders custom text', () => {
      const screen = render(
        <CheckInProvider store={store}>
          <BackButton action={() => {}} text="go back test" />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('back-button')).to.have.text('go back test');
    });
  });
});
