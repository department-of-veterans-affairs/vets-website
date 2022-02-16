'use strict';

const rule = require('../../../rules/prefer-web-component-library');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new RuleTester({ parserOptions });

// Put the import at the top of the "file"
const mockFile = (componentName, snippet) => {
  return `import ${componentName} from '@department-of-veterans-affairs/component-library/${componentName}';
  ${snippet}
  `;
};

ruleTester.run('prefer-web-component-library', rule, {
  // This rule should not trigger on application components, only React components
  // from the `component-library`
  valid: [
    // {
    //   code: `
    //     import Telephone from '../components/Telephone';
    //     const phone = () => (<Telephone contact={phoneContact} />)
    //   `,
    // },
    {
      code: `
        import Breadcrumbs from '../../components/Breadcrumbs';
        const breadcrumbs = () => (<Breadcrumbs><a href="#home">Home</a></Breadcrumbs>)
      `,
    },
  ],
  invalid: [
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone contact={phoneContact} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone contact={phoneContact} />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone pattern={PATTERN["3_DIGIT"]} contact={phoneContact} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              // There is an extra space which would get removed on an autosave format
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone  contact={phoneContact} />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone pattern={PATTERN.OUTSIDE_US} contact={phoneContact} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone international contact={phoneContact} />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone pattern="###" contact={phoneContact} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone  contact={phoneContact} />)',
              ),
            },
          ],
        },
      ],
    },

    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone contact={"800-456-5432"} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone contact={"8004565432"} />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone contact="800-456-5432" />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone contact="8004565432" />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Telephone',
        'const phone = () => (<Telephone notClickable contact={myContact} />)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Telephone',
                'const phone = () => (<va-telephone not-clickable contact={myContact} />)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Breadcrumbs',
        'const breadcrumb = () => (<Breadcrumbs><a href="/">Home</a></Breadcrumbs>)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              output: mockFile(
                'Breadcrumbs',
                'const breadcrumb = () => (<va-breadcrumbs><a href="/">Home</a></va-breadcrumbs>)',
              ),
            },
          ],
        },
      ],
    },
    {
      code: mockFile(
        'Breadcrumbs',
        'const breadcrumb = () => (<Breadcrumbs selectedFacility={selectedResult}><a href="/">Home</a></Breadcrumbs>)',
      ),
      errors: [
        {
          suggestions: [
            {
              desc: 'Migrate component',
              // There is an extra space which would get removed on an autosave format
              output: mockFile(
                'Breadcrumbs',
                'const breadcrumb = () => (<va-breadcrumbs ><a href="/">Home</a></va-breadcrumbs>)',
              ),
            },
          ],
        },
      ],
    },
  ],
});
