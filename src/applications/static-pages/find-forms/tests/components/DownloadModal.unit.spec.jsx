import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DownloadModal from '../../components/DownloadModal';

const removeSpy = sinon.spy();
const url = 'https://test.com/';

describe('DownloadModal', () => {
  describe('download button', () => {
    it('should have the correct attributes', async () => {
      const { container } = render(
        <DownloadModal
          closeModal={removeSpy}
          formName={10109}
          formUrl={url}
          isOpen
        />,
      );

      const links = container.querySelectorAll('va-link');

      expect(links[0].getAttribute('href')).to.eq(
        'https://get.adobe.com/reader/',
      );
      expect(links[0].getAttribute('text')).to.eq(
        'Get Acrobat Reader for free from Adobe',
      );

      expect(links[1].getAttribute('href')).to.eq(url);
      expect(links[1].getAttribute('text')).to.eq('Download VA Form 10109');
      expect(links[1].getAttribute('filetype')).to.eq('PDF');
    });
  });
});
