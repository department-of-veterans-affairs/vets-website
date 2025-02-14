import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DownloadModal from '../../components/DownloadModal';

const removeSpy = sinon.spy();
const url = 'https://test.com/';

describe('DownloadModal', () => {
  describe('download button', () => {
    it('should have the correct attributes', () => {
      const screen = render(
        <DownloadModal
          closeModal={removeSpy}
          formName={10109}
          formUrl={url}
          isOpen
        />,
      );

      expect(
        screen
          .getByRole('link', { name: 'Get Acrobat Reader for free from Adobe' })
          .getAttribute('href'),
      ).to.eq('https://get.adobe.com/reader/');
      expect(
        screen
          .getByRole('link', { name: 'Download VA Form 10109' })
          .getAttribute('href'),
      ).to.eq(url);
    });
  });
});
