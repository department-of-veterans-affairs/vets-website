/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import ConfirmablePage from './index';
import i18n from '../../../utils/i18n/i18n';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    let store;
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      checkInData: {
        context: {
          token: '',
        },
      },
      featureToggles: {
        check_in_experience_translation_pre_check_in_enabled: true,
        check_in_experience_translation_day_of_enabled: true,
      },
    };
    beforeEach(() => {
      store = mockStore(initState);
    });
    describe('ConfirmablePage', () => {
      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage />
            </I18nextProvider>
          </Provider>,
        );
      });
      it('renders the footer if footer is supplied', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage Footer={() => <div>foo</div>} />,
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage header="foo" />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage subtitle="foo" />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom loading message when loading', () => {
        const { getByText } = render(
          // eslint-disable-next-line react/jsx-no-bind
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage
                isLoading
                loadingMessageOverride={() => <div>foo</div>}
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders buttons when loading is false', () => {
        const { getByTestId } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage isLoading={false} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByTestId('yes-button')).to.exist;
        expect(getByTestId('no-button')).to.exist;
      });
      it('renders the data passed in, with label and data', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { foo: 'bar' };

        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage data={data} dataFields={dataFields} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
      });
      it('renders multiple data points the data passed in, with label and data', () => {
        const dataFields = [
          { key: 'foo', title: 'foo-title' },
          { key: 'baz', title: 'baz-title' },
        ];
        const data = { foo: 'bar', baz: 'qux' };

        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage data={data} dataFields={dataFields} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(getByText('baz-title')).to.exist;
        expect(getByText('qux')).to.exist;
      });
      it('renders not available is data is not found, with label and data', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { notFoo: 'bar' };

        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage data={data} dataFields={dataFields} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('Not available')).to.exist;
      });
      it('renders the yes and no buttons with the usa-button-big css class', () => {
        const { getByTestId } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByTestId('yes-button')).to.have.class('usa-button-big');
        expect(getByTestId('no-button')).to.have.class('usa-button-big');
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage yesAction={yesClick} />
            </I18nextProvider>
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage noAction={noClick} />
            </I18nextProvider>
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
    });
    describe('ConfirmablePage Edit button', () => {
      it('does not render an edit button when isEditable is false', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { foo: 'bar' };

        const { getByText, queryByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage data={data} dataFields={dataFields} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(queryByText('Edit')).to.not.exist;
      });
      it('does not render an edit button when isEditable is true and editAction is not supplied', () => {
        const dataFields = [{ key: 'foo', title: 'foo-title' }];
        const data = { foo: 'bar' };

        const { getByText, queryByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage
                data={data}
                dataFields={dataFields}
                isEditEnabled
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(queryByText('Edit')).to.not.exist;
      });
      it('renders an edit button when isEditable is true and field has an edit action', () => {
        const dataFields = [
          { key: 'foo', title: 'foo-title', editAction: () => {} },
        ];
        const data = { foo: 'bar' };

        const { getByText, queryByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage
                data={data}
                dataFields={dataFields}
                isEditEnabled
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(queryByText('Edit')).to.exist;
      });
      it('edit button on click fires the supplied edit action event', () => {
        const editAction = sinon.spy();
        const dataFields = [{ key: 'foo', title: 'foo-title', editAction }];
        const data = { foo: 'bar' };

        const { getByText, queryByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <ConfirmablePage
                data={data}
                dataFields={dataFields}
                isEditEnabled
              />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo-title')).to.exist;
        expect(getByText('bar')).to.exist;
        expect(queryByText('Edit')).to.exist;
        fireEvent.click(getByText('Edit'));
        expect(editAction.calledOnce).to.be.true;

        editAction.calledWith({
          key: 'foo',
          title: 'foo-title',
          editAction,
          value: 'bar',
        });
      });
    });
  });
});
