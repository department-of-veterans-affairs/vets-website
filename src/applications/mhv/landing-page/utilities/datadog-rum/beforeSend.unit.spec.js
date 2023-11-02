import { expect } from 'chai';
import manifest from '../../manifest.json';
import beforeSend from './beforeSend';

const buildAnchor = ({ href = '/find-locations' } = {}) => {
  const el = document.createElement('a');
  el.href = href;
  el.innerText = 'Find VA locations';
  el.dataset.linkGroup = 'Appointments';
  el.dataset.linkTitle = 'mhv-Find-VA-locations';
  return el;
};

const buildEvent = ({ type = 'click', target = buildAnchor() } = {}) => ({
  target,
  type,
  context: {
    theOriginalContext: 'is preserved',
  },
});

describe(`${manifest.appName} -- datadog-rum beforeSend()`, () => {
  describe('non-click events', () => {
    it('does not modify event.context', () => {
      const event = buildEvent({ type: 'other' });
      const originalContext = { ...event.context };
      beforeSend(event);
      expect(event.context).to.deep.equal(originalContext);
    });
  });

  describe('non-anchor elements', () => {
    it('does not modify event.context', () => {
      const event = buildEvent({ target: document.createElement('div') });
      const originalContext = { ...event.context };
      beforeSend(event);
      expect(event.context).to.deep.equal(originalContext);
    });
  });

  describe('click event on HTMLAnchorElement updates event.context', () => {
    it('sets link-group', () => {
      const event = buildEvent();
      beforeSend(event);
      expect(event.context['link-group']).to.equal('Appointments');
    });

    it('sets link-title', () => {
      const event = buildEvent();
      beforeSend(event);
      expect(event.context['link-title']).to.equal('mhv-Find-VA-locations');
    });

    it('sets link-hostname to "localhost" for hostname-less links', () => {
      const event = buildEvent();
      beforeSend(event);
      expect(event.context['link-hostname']).to.equal('localhost');
    });

    it('sets link-hostname to the href hostname', () => {
      const el = buildAnchor({ href: 'https://va.gov/find-locations' });
      const event = buildEvent({ target: el });
      beforeSend(event);
      expect(event.context['link-hostname']).to.equal('va.gov');
    });

    it('preserves the original context', () => {
      const event = buildEvent();
      expect(event.context.theOriginalContext).to.equal('is preserved');
    });
  });
});
