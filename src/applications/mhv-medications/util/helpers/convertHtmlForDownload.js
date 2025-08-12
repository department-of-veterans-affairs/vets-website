import { DOWNLOAD_FORMAT } from '../constants';

/**
 * Return medication information page HTML as text
 */
export const convertHtmlForDownload = async (html, option) => {
  // Dynamically import cheerio at runtime
  const cheerioModule = await import('cheerio');
  const $ = cheerioModule.load(html);
  const contentElements = [
    'address',
    'blockquote',
    'canvas',
    'dd',
    'div',
    'dt',
    'fieldset',
    'figcaption',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'li',
    'p',
    'pre',
  ];
  const elements = $(contentElements.join(', '));
  if (option === DOWNLOAD_FORMAT.PDF) {
    const textBlocks = [];
    elements.each((_, el) => {
      textBlocks.push({
        text: $(el)
          .text()
          .trim(),
        type: el.tagName,
      });
    });
    return textBlocks;
  }
  elements.each((_, el) => {
    if (
      $(el)
        .text()
        .includes('\n')
    ) {
      return;
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tagName)) {
      $(el).prepend('\n');
      $(el).after('\n\n\n');
      return;
    }
    if (el.tagName === 'li') {
      $(el).prepend('\t- ');
      if (!el.next || el.next.name !== 'li') {
        $(el).after('\n\n');
      } else {
        $(el).after('\n');
      }
      return;
    }
    $(el).after('\n\n');
  });
  return $.text().trim();
};
