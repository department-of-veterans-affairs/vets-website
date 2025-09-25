import { expect } from 'chai';
import { sanitizeKramesHtmlStr } from '../../../util/helpers';

describe('sanitizeKramesHtmlStr function', () => {
  it('should remove <Page> tags', () => {
    const inputHtml = '<Page>Page 1</Page>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.not.include('<Page>Page 1</Page>');
  });

  it('should convert h1 tags to h2 tags', () => {
    const inputHtml = '<h1>Heading 1</h1>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="Heading 1" tabindex="-1">Heading 1</h2>',
    );
  });

  it('should convert h3 tags to paragraphs if followed by h2 tags', () => {
    const inputHtml = '<h3>Subheading</h3><h2>Heading 2</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<p>Subheading</p><h2 id="Heading 2" tabindex="-1">Heading 2</h2>',
    );
  });

  it('should combine nested ul tags into one', () => {
    const inputHtml = '<ul><ul><li>Item 1</li></ul></ul>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<ul><li>Item 1</li></ul>');
  });

  it('should convert plain text nodes to paragraphs', () => {
    const inputHtml = 'Some plain text';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include('<p>Some plain text</p>');
  });

  it('should convert h2 tags to sentence case', () => {
    const inputHtml = '<h2>THIS IS A HEADING</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="This is a heading" tabindex="-1">This is a heading</h2>',
    );
  });

  it('should retain the capitalization of I in h2 tags', () => {
    const inputHtml = '<h2>What SPECIAL PRECAUTIONS should I follow?</h2>';
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<h2 id="What special precautions should I follow?" tabindex="-1">What special precautions should I follow?</h2>',
    );
  });

  it('should properly manage <p> tags inside of <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li></ul>',
    );
  });

  it('should properly manage <p> tags inside of nested <ul> tags by restructuring the DOM', () => {
    const inputHtml = `<ul>
                        <li>Item 1</li>
                        <ul>
                        <li>Item 1.1</li>
                        <p>Paragraph inside nested list</p>
                        </ul>
                        <p>Paragraph inside list</p>
                        <li>Item 2</li>
                      </ul>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.include(
      '<ul><li>Item 1</li></ul><p>Paragraph inside list</p><ul><li>Item 2</li><li>Item 1.1</li><p>Paragraph inside nested list</p></ul>',
    );
  });

  it('should remove all pilcrows (¶) from the HTML string', () => {
    const inputHtml = `<div>
                      <strong>
                      <p>¶This branded product is no longer on the market.</p>
                      </strong>
                      <ul>
                      <li>¶BrandName1</li>
                      <li>¶BrandName2</li>
                      </ul>
                      </div>`;
    const outputHtml = sanitizeKramesHtmlStr(inputHtml);
    expect(outputHtml).to.not.include('¶');
    expect(outputHtml).to.include(
      'This branded product is no longer on the market.',
    );
    expect(outputHtml).to.include('BrandName1');
    expect(outputHtml).to.include('BrandName2');
  });
});
