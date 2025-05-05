import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import {
  WrapContent,
  WrapPage,
  showLoading,
  ItfSearchSpinner,
  ItfCreateSpinner,
  itfMessage,
  ItfCreatedAlert,
  ItfFoundAlert,
  ItfFailedAlert,
} from '../content';

describe('content unit tests', () => {
  describe('WrapContent', () => {
    it('should render the content', () => {
      const { container } = render(<WrapContent content="Testing" />);
      expect(container.innerHTML).to.equal(
        '<div class="itf-wrapper">Testing</div>',
      );
    });
  });

  describe('WrapPage', () => {
    const content = <div>Testing</div>;
    const baseUrl = '/test';
    it('should render the content with buttons', () => {
      const { container } = render(
        <WrapPage
          content={content}
          setMessageDismissed={() => {}}
          baseUrl={baseUrl}
          router={{}}
        />,
      );
      waitFor(() => {
        expect($('.itf-inner', container)).to.exist;
        expect($('.usa-content', container).textContent).to.include('Testing');
        expect($('va-button-pair', container)).to.exist;
      });
    });
    it('should call goHome when the home button is clicked', () => {
      const router = { push: sinon.spy() };
      const { container } = render(
        <WrapPage
          content={content}
          setMessageDismissed={() => {}}
          baseUrl={baseUrl}
          router={router}
        />,
      );
      $('a.back-link', container).click();
      expect(router.push.calledWith(`${baseUrl}/introduction`)).to.be.true;
    });
    it('should call dismissMessage when the dismiss (continue) button is clicked', () => {
      const setMessageDismissedSpy = sinon.spy();
      const { container } = render(
        <WrapPage
          content={content}
          setMessageDismissed={setMessageDismissedSpy}
          baseUrl={baseUrl}
          router={{}}
        />,
      );
      $('va-button', container).click();
      expect(setMessageDismissedSpy.calledOnce).to.be.true;
    });
  });

  describe('showLoading', () => {
    it('should render a loading indicator', () => {
      const message = 'Loading...';
      const label = 'Loading label';
      const { container } = render(showLoading(message, label));

      waitFor(() => {
        const loading = $('va-loading-indicator', container);
        expect(loading).to.exist;
        expect(loading.getAttribute('message')).to.equal(message);
        expect(loading.getAttribute('label')).to.equal(label);
      });
    });
  });

  describe('ItfSearchSpinner', () => {
    it('should render a loading indicator', () => {
      const { container } = render(ItfSearchSpinner());

      const loading = $('va-loading-indicator', container);
      expect(loading).to.exist;
      expect(loading.getAttribute('message')).to.contain(
        'see if you have an existing Intent to File',
      );
      expect(loading.getAttribute('label')).to.equal(
        'looking for an intent to file',
      );
    });
  });

  describe('ItfCreateSpinner', () => {
    it('should render a loading indicator', () => {
      const { container } = render(ItfCreateSpinner());

      const loading = $('va-loading-indicator', container);
      expect(loading).to.exist;
      expect(loading.getAttribute('message')).to.contain(
        'wait while we create your Intent to File',
      );
      expect(loading.getAttribute('label')).to.equal(
        'creating an intent to file',
      );
    });
  });

  describe('itfMessage', () => {
    it('should render a message with the correct headline and content', () => {
      const { container } = render(
        itfMessage({
          status: 'info',
          headline: 'Heading',
          content: <div>Content</div>,
        }),
      );

      const alert = $('va-alert', container);
      expect(alert).to.exist;
      expect($('h2', alert).textContent).to.equal('Heading');
      expect($('div', alert).textContent).to.equal('Content');
      expect(alert.getAttribute('status')).to.equal('info');
    });
  });

  describe('ItfCreatedAlert', () => {
    it('should render a success message with the correct headline and content', () => {
      const itfType = 'pension';
      const expirationDateFormatted = '2023-12-31';

      const { container } = render(
        ItfCreatedAlert({ itfType, expirationDateFormatted }),
      );

      const alert = $('va-alert', container);
      expect(alert).to.exist;
      expect($('h2', alert).textContent).to.equal(
        `Your intent to file a ${itfType} application`,
      );
      expect($('div', alert).textContent).to.contain(
        'We automatically recorded your intent to file',
      );
      expect($('span', alert).textContent).to.contain(
        `Submit your application by ${expirationDateFormatted}`,
      );
    });
  });

  describe('ItfFoundAlert', () => {
    it('should render a success message with the correct headline and content', () => {
      const itfType = 'compensation';
      const expirationDateFormatted = '2023-12-31';

      const { container } = render(
        ItfFoundAlert({ itfType, expirationDateFormatted }),
      );

      const alert = $('va-alert', container);
      expect(alert).to.exist;
      expect($('h2', alert).textContent).to.equal(
        'We’ve recorded your intent to file',
      );
      expect($('div', alert).textContent).to.contain(
        `We’ve found your intent to file a ${itfType} application in our records.`,
      );
      expect($('span', alert).textContent).to.contain(
        `Submit your application by ${expirationDateFormatted}`,
      );
    });
  });

  describe('ItfFailedAlert', () => {
    it('should render an info message with the correct headline and content', () => {
      const itfType = 'survivor';

      const { container } = render(ItfFailedAlert({ itfType }));

      const alert = $('va-alert', container);
      expect(alert).to.exist;
      expect($('h2', alert).textContent).to.equal(
        `You may want to confirm your intent to file for ${itfType} benefits`,
      );
      expect($('div', alert).textContent).to.contain(
        'We tried to check for your intent to file',
      );
    });
  });
});
