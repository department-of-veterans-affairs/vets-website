const { expect } = require('chai');

const getErrorOutput = require('../../helpers/getErrorOutput');

describe('getErrorOutput', () => {
  it('outputs formatted violations', () => {
    const pageFailure = {
      url: 'https://example.va.gov/accessibility-issue',
      violations: [
        {
          impact: 'serious',
          help: 'Links must have discernible text',
          helpUrl:
            'https://dequeuniversity.com/rules/axe/2.6/link-name?application=axeAPI',
          nodes: [
            {
              html:
                '<a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp"></a>',
              target: 'li:nth-child(2) > a[href$="Urgent_Care.asp"]',
            },
          ],
        },
        {
          impact: 'serious',
          help: 'Links must have discernible text',
          helpUrl:
            'https://dequeuniversity.com/rules/axe/2.6/link-name?application=axeAPI',
          nodes: [
            {
              html:
                '<a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp"></a>',
              target: 'li:nth-child(2) > a[href$="Urgent_Care.asp"]',
            },
          ],
        },
      ],
    };

    const result = getErrorOutput(pageFailure);

    expect(result).to.contain('Failed with 2 violation(s)');
    expect(result).to.contain(
      '<a href="https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp"></a>',
    );
  });
});
