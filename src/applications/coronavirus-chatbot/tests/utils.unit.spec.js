import { markdownRenderer } from '../utils.js';
import { expect } from 'chai';

describe('markdownRenderer', () => {
  it('should render markdown links to open in new tabs', () => {
    const sampleInput = '[Example](http://www.example.com)';
    const expectedOutput =
      '<a href="http://www.example.com" target="_blank" rel="noopener">Example</a>';

    expect(markdownRenderer.renderInline(sampleInput)).to.equal(expectedOutput);
  });

  it('should render markdown links to open in new tabs within paragraphs', () => {
    const sampleInput =
      "**To find your nearest VA health facility's phone number**\n\nUse our website's [**Find VA locations** tool](https://www.va.gov/find-locations).";
    const expectedOutput =
      '<p><strong>To find your nearest VA health facility\'s phone number</strong></p>\n<p>Use our website\'s <a href="https://www.va.gov/find-locations" target="_blank" rel="noopener"><strong>Find VA locations</strong> tool</a>.</p>\n';

    expect(markdownRenderer.render(sampleInput)).to.equal(expectedOutput);
  });

  it('should render HTML links as is', () => {
    const sampleInput =
      '<a href="http://www.example.com" rel="noopener">Example</a>';
    const expectedOutput =
      '<a href="http://www.example.com" rel="noopener">Example</a>';

    expect(markdownRenderer.renderInline(sampleInput)).to.equal(expectedOutput);
  });
});
