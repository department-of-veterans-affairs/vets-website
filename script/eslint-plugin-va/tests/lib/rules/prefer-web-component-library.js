'use strict';

const rule = require('../../../rules/prefer-web-component-library');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('prefer-web-component-library', rule, {
  valid: [],
  invalid: [
    {
      code: 'const phone = () => (<Telephone contact={phoneContact} />)',
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output:
                'const phone = () => (<va-telephone contact={phoneContact} />)',
            },
          ],
        },
      ],
    },
    {
      code:
        'const phone = () => (<Telephone pattern={PATTERN["3_DIGIT"]} contact={phoneContact} />)',
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              // There is an extra space which would get removed on an autosave format
              output:
                'const phone = () => (<va-telephone  contact={phoneContact} />)',
            },
          ],
        },
      ],
    },
    {
      code:
        'const phone = () => (<Telephone pattern={PATTERN.OUTSIDE_US} contact={phoneContact} />)',
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output:
                'const phone = () => (<va-telephone international contact={phoneContact} />)',
            },
          ],
        },
      ],
    },
    {
      code: 'const phone = () => (<Telephone contact={"800-456-5432"} />)',
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output:
                "const phone = () => (<va-telephone contact={'8004565432'} />)",
            },
          ],
        },
      ],
    },
    {
      code:
        'const phone = () => (<Telephone notClickable contact={myContact} />)',
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output:
                'const phone = () => (<va-telephone not-clickable contact={myContact} />)',
            },
          ],
        },
      ],
    },
  ],
});
