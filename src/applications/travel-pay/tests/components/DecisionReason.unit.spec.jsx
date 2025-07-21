import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import DecisionReason from '../../components/DecisionReason';
import { STATUSES } from '../../constants';

describe('DecisionReason', () => {
  it('should render denied claim heading when status is Denied', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Your claim was denied because...',
    };

    const screen = render(<DecisionReason {...props} />);
    expect(screen.getByText('Why we denied your claim')).to.exist;
  });

  it('should render partial payment heading when status is not Denied', () => {
    const props = {
      claimStatus: 'Some Other Status',
      decisionLetterReason: 'Partial payment was made because...',
    };

    const screen = render(<DecisionReason {...props} />);
    expect(screen.getByText('Why we made a partial payment')).to.exist;
  });

  it('should render decision reason text without CFR references', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Your claim was denied due to insufficient documentation.',
    };

    const screen = render(<DecisionReason {...props} />);
    expect(
      screen.getByText(
        'Your claim was denied due to insufficient documentation.',
      ),
    ).to.exist;
  });

  it('should handle empty decision letter reason', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: '',
    };

    const screen = render(<DecisionReason {...props} />);
    expect(screen.getByText('Why we denied your claim')).to.exist;
    // Should not throw error and render empty content
    const reasonParagraph = screen.container.querySelector(
      'p.vads-u-margin-top--0',
    );
    expect(reasonParagraph.textContent).to.equal('');
  });

  it('should handle null decision letter reason', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: null,
    };

    const screen = render(<DecisionReason {...props} />);
    expect(screen.getByText('Why we denied your claim')).to.exist;
    // Should not throw error and render empty content
    const reasonParagraph = screen.container.querySelector(
      'p.vads-u-margin-top--0',
    );
    expect(reasonParagraph.textContent).to.equal('');
  });

  it('should convert single CFR reference to hyperlink', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Your claim was denied per Authority 38 CFR 3.4 regulations.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check that the link exists
    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-38/chapter-I/section-3.4',
    );
    expect(link.getAttribute('external')).to.equal('true');
    expect(link.getAttribute('text')).to.equal('Authority 38 CFR 3.4');

    // Check that surrounding text is preserved
    expect(screen.container.textContent).to.include(
      'Your claim was denied per',
    );
    expect(screen.container.textContent).to.include('regulations.');
  });

  it('should convert multiple CFR references to hyperlinks', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Denied per Authority 38 CFR 3.4 and Authority 42 CFR 12.5 regulations.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check that both links exist
    const links = screen.container.querySelectorAll('va-link');
    expect(links).to.have.length(2);

    // Check first link
    expect(links[0].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-38/chapter-I/section-3.4',
    );
    expect(links[0].getAttribute('text')).to.equal('Authority 38 CFR 3.4');

    // Check second link
    expect(links[1].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-42/chapter-I/section-12.5',
    );
    expect(links[1].getAttribute('text')).to.equal('Authority 42 CFR 12.5');

    // Check that surrounding text is preserved using textContent
    expect(screen.container.textContent).to.include('Denied per');
    expect(screen.container.textContent).to.include('and');
    expect(screen.container.textContent).to.include('regulations.');
  });

  it('should handle CFR references with different title and section numbers', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Reference Authority 45 CFR 164.102 for privacy rules.',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-45/chapter-I/section-164.102',
    );
    expect(link.getAttribute('text')).to.equal('Authority 45 CFR 164.102');
  });

  it('should preserve text that looks similar to CFR but does not match exact pattern', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Some authority CFR reference that does not match the pattern.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Should not create any links
    const links = screen.container.querySelectorAll('va-link');
    expect(links).to.have.length(0);

    // Should render the text as-is
    expect(
      screen.getByText(
        'Some authority CFR reference that does not match the pattern.',
      ),
    ).to.exist;
  });

  it('should handle CFR reference at the beginning of text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Authority 38 CFR 3.4 requires additional documentation.',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Authority 38 CFR 3.4');
    expect(screen.container.textContent).to.include(
      'requires additional documentation.',
    );
  });

  it('should handle CFR reference at the end of text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Your claim violates Authority 38 CFR 3.4',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Authority 38 CFR 3.4');
    expect(screen.container.textContent).to.include('Your claim violates');
  });

  it('should handle text with only CFR reference and no surrounding text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Authority 38 CFR 3.4',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('Authority 38 CFR 3.4');
  });

  it('should convert CFR reference without Authority prefix to hyperlink', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Your claim was denied per 38 CFR 3.4 regulations.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check that the link exists
    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-38/chapter-I/section-3.4',
    );
    expect(link.getAttribute('external')).to.equal('true');
    expect(link.getAttribute('text')).to.equal('38 CFR 3.4');

    // Check that surrounding text is preserved
    expect(screen.container.textContent).to.include(
      'Your claim was denied per',
    );
    expect(screen.container.textContent).to.include('regulations.');
  });

  it('should convert mixed CFR references (with and without Authority) to hyperlinks', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Denied per Authority 38 CFR 3.4 and 42 CFR 12.5 regulations.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check that both links exist
    const links = screen.container.querySelectorAll('va-link');
    expect(links).to.have.length(2);

    // Check first link (with Authority)
    expect(links[0].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-38/chapter-I/section-3.4',
    );
    expect(links[0].getAttribute('text')).to.equal('Authority 38 CFR 3.4');

    // Check second link (without Authority)
    expect(links[1].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-42/chapter-I/section-12.5',
    );
    expect(links[1].getAttribute('text')).to.equal('42 CFR 12.5');

    // Check that surrounding text is preserved
    expect(screen.container.textContent).to.include('Denied per');
    expect(screen.container.textContent).to.include('and');
    expect(screen.container.textContent).to.include('regulations.');
  });

  it('should handle CFR reference without Authority at the beginning of text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: '38 CFR 3.4 requires additional documentation.',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('38 CFR 3.4');
    expect(screen.container.textContent).to.include(
      'requires additional documentation.',
    );
  });

  it('should handle CFR reference without Authority at the end of text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Your claim violates 38 CFR 3.4',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('38 CFR 3.4');
    expect(screen.container.textContent).to.include('Your claim violates');
  });

  it('should handle text with only CFR reference (no Authority) and no surrounding text', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: '38 CFR 3.4',
    };

    const screen = render(<DecisionReason {...props} />);

    const link = screen.container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal('38 CFR 3.4');
  });

  it('should handle multiple CFR references without Authority prefix', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason:
        'Denied per 38 CFR 3.4 and 42 CFR 12.5 regulations.',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check that both links exist
    const links = screen.container.querySelectorAll('va-link');
    expect(links).to.have.length(2);

    // Check first link
    expect(links[0].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-38/chapter-I/section-3.4',
    );
    expect(links[0].getAttribute('text')).to.equal('38 CFR 3.4');

    // Check second link
    expect(links[1].getAttribute('href')).to.equal(
      'https://www.ecfr.gov/current/title-42/chapter-I/section-12.5',
    );
    expect(links[1].getAttribute('text')).to.equal('42 CFR 12.5');

    // Check that surrounding text is preserved
    expect(screen.container.textContent).to.include('Denied per');
    expect(screen.container.textContent).to.include('and');
    expect(screen.container.textContent).to.include('regulations.');
  });

  it('should apply correct CSS classes to elements', () => {
    const props = {
      claimStatus: STATUSES.Denied.name,
      decisionLetterReason: 'Test reason',
    };

    const screen = render(<DecisionReason {...props} />);

    // Check heading paragraph classes
    const headingParagraph = screen.container.querySelector(
      'p.vads-u-font-weight--bold.vads-u-margin-bottom--0',
    );
    expect(headingParagraph).to.exist;

    // Check reason paragraph classes
    const reasonParagraph = screen.container.querySelector(
      'p.vads-u-margin-top--0',
    );
    expect(reasonParagraph).to.exist;
  });
});
