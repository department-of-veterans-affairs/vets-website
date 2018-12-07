module.exports.rules = {
  unmount: context => {
    let shallowMountNode = null;
    let unmountNode = null;
    return {
      "CallExpression[callee.name='it'] > ArrowFunctionExpression Identifier[name=/shallow|mount|unmount/]": node => {
        if (node.name === 'shallow' || node.name === 'mount') {
          shallowMountNode = node;
        }

        if (node.name === 'unmount') {
          unmountNode = node;
        }
      },
      "CallExpression[callee.name='it'] > ArrowFunctionExpression:exit": () => {
        if (shallowMountNode && unmountNode === null) {
          context.report(
            shallowMountNode,
            `${shallowMountNode.name}() has no matching ReactWrapper.unmount()`,
          );
        }
        shallowMountNode = null;
        unmountNode = null;
      },
    };
  },
};
