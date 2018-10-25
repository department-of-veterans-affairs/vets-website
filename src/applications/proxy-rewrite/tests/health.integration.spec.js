/**
 * @jest-environment jest-environment-selenium
 */

const url = 'https://preview.va.gov/health/';
// afterEach(async () => cleanup());
describe('Veterans Health Administration Page', () => {
  jest.setTimeout(15000);
  test('it renders', async () => {
    await driver.get(url); // eslint-disable-line no-undef
    const title = await driver.findElement(By.tagName('h1')).getText(); // eslint-disable-line no-undef
    expect(title).toContain('Veterans Health Administration');
  });
  test('it toggles banner', async () => {
    await driver.get(url); // eslint-disable-line no-undef
    const bannerToggle = await driver // eslint-disable-line
      .findElement(By.id('usa-banner-toggle')) // eslint-disable-line no-undef
      .click();
    const bannerContent = await driver // eslint-disable-line no-undef
      .findElement(By.id('gov-banner')) // eslint-disable-line no-undef
      .getText();
    expect(bannerContent).toContain('.gov means it’s official');
  });

  describe('save a screenshot of the header', () => {
    test('save a picture', async () => {
      await driver.get(url); // eslint-disable-line no-undef
      const image = await driver.takeScreenshot(); // eslint-disable-line no-undef
      expect(image).toMatchImageSnapshot();
    });
    test('save a small picture', async () => {
      await driver // eslint-disable-line no-undef
        .manage()
        .window()
        .setSize(400, 768);
      await driver.get(url); // eslint-disable-line no-undef
      const image = await driver.takeScreenshot(); // eslint-disable-line no-undef
      expect(image).toMatchImageSnapshot();
    });
  });
  describe('save a screenshot of the footer', () => {
    test('save a picture', async () => {
      await driver.get(url); // eslint-disable-line no-undef
      const ele = driver.findElement(By.tagName('footer')); // eslint-disable-line no-undef
      driver.executeScript('arguments[0].scrollIntoView();', ele); // eslint-disable-line no-undef
      const image = await driver.takeScreenshot(); // eslint-disable-line no-undef
      expect(image).toMatchImageSnapshot();
    });
  });
});
