/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-template */
exports.handlers = {
  beforeParse(e) {
    // remove jsdoc comments with no @tags
    e.source = e.source.replace(/\/\*\*([^@]*?)\*\//g, '');

    // remove jsdoc comments with @ignoreDocs
    e.source = e.source
      .split(/(\/\*\*[\s\S]*?\*\/)/g)
      .filter(block => !/@ignoreDocs/.test(block))
      .join('');
  },
  jsdocCommentFound(jsdocComment, parser) {
    // replace all instances of & with | in the jsdoc comment because it
    // is unable to parse some complex types
    const tags = ['type', 'property', 'prop', 'param', 'typedef', 'returns'];
    for (const tag of tags) {
      const r = new RegExp('^.+@' + tag + '\\s*\\{(?:.+&.+)\\s*\\}', 'gm');
      let match = r.exec(jsdocComment.comment);
      while (match && match.length) {
        const len = match[0].length;
        const before = jsdocComment.comment.substr(0, match.index);
        const after = jsdocComment.comment.substr(match.index + len);
        const replaced = match[0].replace(/&/g, '|');
        jsdocComment.comment = before + replaced + after;
        match = r.exec(jsdocComment.comment);
      }
    }
  },
};
