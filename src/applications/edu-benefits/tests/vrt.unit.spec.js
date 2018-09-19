
/**
 * @jest-environment jest-environment-webdriver
 */
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

const url = 'http://localhost:3001/education/gi-bill-school-feedback/introduction';

describe('GI Bill School Feedback Tool Introduction Page', () => {
  test('it renders', async () => {
    await browser.get(url); // eslint-disable-line no-undef
    const title = await browser.findElement(by.tagName('h1')).getText();  // eslint-disable-line no-undef
    expect(title).toContain('GI Bill® School Feedback Tool');
  });

  // test('loads the latest version number from GitHub', async () => {
  //   const foundAndLoadedCheck = async () => {
  //     await until.elementLocated(by.id('latestRelease'))
  //     const value = await browser.findElement(by.id('latestRelease')).getText()
  //     return value !== '~'
  //   }

  //   await browser.wait(foundAndLoadedCheck, 3000)
  //   const latestRelease = await browser.findElement(by.id('latestRelease')).getText()
  //   expect(latestRelease).toEqual('v17.1.3')
  // })

  describe('save a screenshot from the browser', () => {
    test('save a picture', async () => {
      // files saved in ./reports/screenshots by default
      await browser.get(url); // eslint-disable-line no-undef
      const image = await browser.takeScreenshot(); // eslint-disable-line no-undef
      expect(image).toMatchImageSnapshot();
    });
  });
});
