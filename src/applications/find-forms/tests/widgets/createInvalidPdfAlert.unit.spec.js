import sinon from 'sinon';
import { expect } from 'chai';

import {
  mockFetch,
  setFetchJSONResponse as setFetchResponse,
  resetFetch,
} from 'platform/testing/unit/helpers';

import { onDownloadLinkClick } from '../../widgets/createInvalidPdfAlert';
import { escapeRegExp } from 'lodash';

describe('createInvalidPdfAlert', () => {
  beforeEach(() => {
    mockFetch();
    setFetchResponse(global.fetch.onFirstCall(), {
      data: [
        {
          id: '10-10EZ',
          type: 'va_form',
          attributes: { validPdf: true },
        },
        {
          id: 'VA0927b',
          type: 'va_form',
          attributes: { validPdf: false },
        },
      ],
    });
  });

  afterEach(() => {
    resetFetch();
  });

  it('shows an alert banner for invalid forms', async () => {
    const link = {
      click: sinon.stub(),
      href: 'https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf',
      dataset: {
        formNumber: 'VA0927b',
      },
      remove: sinon.stub(),
      parentNode: {
        insertBefore: sinon.stub(),
      },
    };

    const event = {
      target: link,
      preventDefault: sinon.stub(),
    };

    await onDownloadLinkClick(event);

    expect(link.click.called).to.be.false;
    expect(link.parentNode.insertBefore.called).to.be.true;

    const alertBox = link.parentNode.insertBefore.firstCall.args[0];

    expect(alertBox).to.be.instanceOf(HTMLDivElement);
    expect(alertBox.innerHTML).to.include('We’re sorry');
    expect(link.remove.called).to.be.true;
  });

  it('shows an alert banner for invalid forms', async () => {
    const link = {
      click: sinon.stub(),
      removeEventListener: sinon.stub(),
      href: 'https://www.va.gov/vaforms/medical/pdf/10-10EZ-fillable.pdf',
      dataset: {
        formNumber: '10-10EZ',
      },
      remove: sinon.stub(),
    };

    const event = {
      target: link,
      preventDefault: sinon.stub(),
    };

    await onDownloadLinkClick(event);

    expect(link.remove.called).to.be.false;
    expect(link.removeEventListener.called).to.be.true;
    expect(link.click.called).to.be.true;
  });
});
