import { expect } from 'chai';
import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FileExportErrorNotification from '../../../components/MedicationsList/FileExportErrorNotification';
import reducers from '../../../reducers';
import { DOWNLOAD_FORMAT } from '../../../util/constants';

describe('FileExportErrorNotification component', () => {
  const setup = (pdfTxtGenerateStatus, initialState = {}) => {
    return renderWithStoreAndRouterV6(
      <FileExportErrorNotification
        pdfTxtGenerateStatus={pdfTxtGenerateStatus}
      />,
      {
        initialState,
        reducers,
      },
    );
  };

  it('renders without errors with PDF format', () => {
    const pdfTxtGenerateStatus = {
      format: DOWNLOAD_FORMAT.PDF,
    };
    const screen = setup(pdfTxtGenerateStatus);
    expect(screen).to.exist;
  });

  it('renders without errors with TXT format', () => {
    const pdfTxtGenerateStatus = {
      format: DOWNLOAD_FORMAT.TXT,
    };
    const screen = setup(pdfTxtGenerateStatus);
    expect(screen).to.exist;
  });

  it('displays correct information', () => {
    const pdfTxtGenerateStatus = {
      format: DOWNLOAD_FORMAT.PDF,
    };
    const screen = setup(pdfTxtGenerateStatus);
    const phoneElements = screen.container.querySelectorAll('va-telephone');
    expect(phoneElements.length).to.equal(2);
    expect(phoneElements[0].getAttribute('contact')).to.equal('8773270022');
    expect(phoneElements[1].getAttribute('contact')).to.equal(CONTACTS[711]);
    expect(phoneElements[1].hasAttribute('tty')).to.be.true;
  });
});
