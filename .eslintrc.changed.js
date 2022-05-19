module.exports = {
  extends: './.eslintrc.js',
  rules: {
    'jsx-a11y/control-has-associated-label': 1,
    'jsx-a11y/click-events-have-key-events': 2,
    'jsx-a11y/anchor-is-valid': 2,
    'jsx-a11y/label-has-associated-control': 1,
    'jsx-a11y/no-static-element-interactions': 2,
    'deprecate/import': [
      'warn',
      {
        name: 'web-components/react-bindings',
        use:
          '@department-of-veterans-affairs/component-library/dist/react-bindings',
      },
    ],
  },
};
