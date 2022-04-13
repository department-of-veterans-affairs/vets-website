import { buildPath, buildRelativePath } from '../../src/utils/helpers';

describe('Helpers - buildPath', () => {
  test('It returns expected results', () => {
    const result1 = buildPath('/chapter-one', '/page-one');
    const expectedResult1 = '/chapter-one/page-one';
    expect(result1).toEqual(expectedResult1);

    const result2 = buildPath('chapter-one', 'page-one');
    const expectedResult2 = 'chapter-one/page-one';
    expect(result2).toEqual(expectedResult2);

    const result3 = buildPath('/chapter-one/', '/page-one/', '/');
    const expectedResult3 = '/chapter-one/page-one';
    expect(result3).toEqual(expectedResult3);

    const result4 = buildPath('');
    const expectedResult4 = '';
    expect(result4).toEqual(expectedResult4);

    const result5 = buildPath('//a', '', '/', '/b/');
    const expectedResult5 = '//a/b';
    expect(result5).toEqual(expectedResult5);

    const result6 = buildPath('https://google.com/', 'my', 'path');
    const expectedResult6 = 'https://google.com/my/path';
    expect(result6).toEqual(expectedResult6);
  });
});

describe('Helpers - buildRelativePath', () => {
  test('It returns expected results', () => {
    const result1 = buildRelativePath('/chapter-one', '/page-one');
    const expectedResult1 = '/chapter-one/page-one';
    expect(result1).toEqual(expectedResult1);

    const result2 = buildRelativePath('chapter-one', 'page-one');
    const expectedResult2 = '/chapter-one/page-one';
    expect(result2).toEqual(expectedResult2);

    const result3 = buildRelativePath('/chapter-one/', '/page-one/', '/');
    const expectedResult3 = '/chapter-one/page-one';
    expect(result3).toEqual(expectedResult3);

    const result4 = buildRelativePath('');
    const expectedResult4 = '/';
    expect(result4).toEqual(expectedResult4);

    const result5 = buildRelativePath('//a', '', '/', '/b/');
    const expectedResult5 = '//a/b';
    expect(result5).toEqual(expectedResult5);
  });
});
