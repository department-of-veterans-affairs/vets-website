import sinon from 'sinon';
import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse as setFetchResponse,
} from '~/platform/testing/unit/helpers';

import { onDownloadLinkClick } from '../../widgets/createFindVaFormsPDFDownloadHelper';

describe('createInvalidPdfAlert', () => {
  beforeEach(() => {
    mockFetch();
    setFetchResponse(global.fetch.onFirstCall(), {
      data: [
        {
          id: '10-10EZ',
          type: 'va_form',
          attributes: {
            deletedAt: null,
            validPdf: true,
            formName: '10-10EZ',
          },
        },
        {
          id: 'VA0927b',
          type: 'va_form',
          attributes: {
            deletedAt: '2020-08-18T00:00:00.000Z',
            validPdf: false,
            formName: 'VA0927b',
          },
        },
      ],
    });
  });
  const reduxStore = {
    getState: () => {
      return {
        featureToggles: {},
      };
    },
  };

  it('shows an alert banner for invalid forms', async () => {
    const link = {
      click: sinon.stub(),
      href: 'https://www.va.gov/vaforms/va/pdf/VA0927b.pdf',
      dataset: {
        formNumber: 'VA0927b',
      },
      parentNode: {
        removeChild: sinon.stub(),
        insertBefore: sinon.stub(),
      },
    };

    const event = {
      target: link,
      preventDefault: sinon.stub(),
    };

    await onDownloadLinkClick(event, reduxStore, sinon.stub());

    expect(link.click.called).to.be.false;
    expect(link.parentNode.insertBefore.called).to.be.true;

    const alertBox = link.parentNode.insertBefore.firstCall.args[0];

    expect(alertBox).to.be.instanceOf(HTMLDivElement);
    expect(alertBox.innerHTML).to.include('We’re sorry');
    expect(link.parentNode.removeChild.called).to.be.true;
  });

  it('does not show an alert banner for valid forms', async () => {
    const link = {
      click: sinon.stub(),
      removeEventListener: sinon.stub(),
      href: 'https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf',
      dataset: {
        formNumber: '10-10EZ',
      },
      parentNode: {
        removeChild: sinon.stub(),
      },
    };

    const event = {
      target: link,
      preventDefault: sinon.stub(),
    };

    await onDownloadLinkClick(event, reduxStore, sinon.stub());

    expect(link.parentNode.removeChild.called).to.be.false;
    expect(link.removeEventListener.called).to.be.true;
    expect(link.click.called).to.be.true;
  });
});
