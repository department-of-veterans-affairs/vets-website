import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DownloadPDFModal from '../../widgets/createFindVaFormsPDFDownloadHelper/DownloadPDFModal';

const removeSpy = sinon.spy();
const url = 'https://test.com/';

describe('DownloadPDFModal', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(
      <DownloadPDFModal formNumber={10109} removeNode={removeSpy} url={url} />,
    );

    expect(getByTestId('faf-pdf-alert-modal')).to.exist;
  });

  describe('download button', () => {
    it('should have the correct attributes', () => {
      const { getByRole } = render(
        <DownloadPDFModal
          formNumber={10109}
          removeNode={removeSpy}
          url={url}
        />,
      );

      const button = getByRole('button');
      expect(button).to.have.property('href', url);
      expect(button).to.have.text('Download VA Form 10109');
    });
  });
});
