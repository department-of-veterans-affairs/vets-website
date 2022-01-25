const description = 'Typographic apostrophes should be used within the content';
const message = 'Replace single quote with typographic apostrophe';

// https://en.wikipedia.org/wiki/Wikipedia:List_of_English_contractions
const contractionEndings = [
  'clock', // o'clock
  'd', // we'd, that'd
  'll', // we'll, it'll
  're', // we're
  's', // it's, let's
  't', // don't, won't, shouldn't, etc
  've', // could've
];

const regexpReplacer = /'/g;
const regexpApostrophe = new RegExp(
  `(?:[a-z]')(?:${contractionEndings.join('|')})\\b`,
  'gmi',
);

const contentTypes = ['TemplateLiteral', 'JSXText', 'JSXAttribute'];

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description,
      category: 'best practices',
      recommended: true,
    },
    schema: [],
  },
  create: context => {
    const sourceCode = context.getSourceCode();
    const replacer = node =>
      node.value.replace(regexpApostrophe, match =>
        match.replace(regexpReplacer, '’'),
      );

    return {
      VariableDeclarator: outerNode => {
        const nodes = sourceCode.getTokens(outerNode);
        for (const node of nodes) {
          if (
            contentTypes.includes(node.type) &&
            regexpApostrophe.test(node.value)
          ) {
            context.report({
              node,
              message,
              fix: fixer => fixer.replaceText(node, replacer(node)),
            });
          }
        }
      },
    };
  },
};
