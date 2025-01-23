/**
 * @typedef {Object} HeadingNode
 * @property {string} text - The text content of the heading
 * @property {number} level - The heading level (1-6)
 * @property {string} source - Whether the heading is from main DOM or shadow DOM
 * @property {HeadingNode[]} children - Child heading nodes
 * @property {Element} element - The original heading element
 * @property {string} path - DOM path to the heading
 */

class HeadingHierarchyAnalyzer {
  /**
   * Analyzes heading hierarchy in both regular DOM and shadow DOM
   * @param {Element} rootElement - The root element to start analysis from
   * @returns {Object} Analysis results including heading tree and issues
   */
  analyze(rootElement = document.body) {
    const headings = this.collectHeadings(rootElement);
    const tree = HeadingHierarchyAnalyzer.buildHeadingTree(headings);
    const issues = HeadingHierarchyAnalyzer.findHeadingIssues(headings);

    return {
      tree,
      issues,
      headings,
    };
  }

  /**
   * Collects all headings from both regular DOM and shadow DOM
   * @param {Element} element - The element to collect headings from
   * @param {string} [pathPrefix=''] - Current DOM path prefix
   * @returns {HeadingNode[]} Array of heading nodes
   */
  collectHeadings(element, pathPrefix = '') {
    const headings = [];

    // Process DOM element and add headings to the array when found
    const processElement = (el, path) => {
      // Check if element is a heading
      if (el?.matches?.('h1, h2, h3, h4, h5, h6')) {
        headings.push({
          text: el.textContent.trim(),
          level: parseInt(el.tagName[1], 10),
          source: 'dom',
          element: el,
          path: `${path} > ${el.tagName.toLowerCase()}`,
          children: [],
        });
      }

      // Process shadow DOM if present
      if (el?.shadowRoot) {
        const shadowHeadings = this.collectHeadings(
          el.shadowRoot,
          `${path} > #shadow-root`,
        );
        headings.push(
          ...shadowHeadings.map(h => ({
            ...h,
            source: 'shadow-dom',
          })),
        );
      }

      // Process child elements
      Array.from(el.children).forEach((child, index) => {
        processElement(
          child,
          `${path} > ${child.tagName.toLowerCase()}[${index}]`,
        );
      });
    };

    processElement(element, pathPrefix);
    return headings;
  }

  /**
   * Builds a tree structure from flat headings array
   * used to visualize the tree in the UI
   * @param {HeadingNode[]} headings - Array of heading nodes
   * @returns {HeadingNode[]} Tree structure of headings
   */
  static buildHeadingTree(headings) {
    const root = { level: 0, children: [] };
    const stack = [root];

    headings.forEach(heading => {
      while (
        stack.length > 1 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop(); // important to pop the last element from the stack when the current heading level is less than the last element's level
      }

      const parent = stack[stack.length - 1]; // get parent
      parent.children.push(heading); // add heading to parent's children
      stack.push(heading); // add heading to stack
    });

    return root.children;
  }

  /**
   * Finds heading hierarchy issues
   * @param {HeadingNode[]} headings - Array of heading nodes
   * @returns {Object[]} Array of heading issues
   */
  static findHeadingIssues(headings) {
    const issues = [];

    // Check for missing h1
    if (!headings.some(h => h.level === 1)) {
      issues.push({
        type: 'missing-h1',
        message: 'Page is missing an h1 heading',
      });
    }

    // Check for multiple h1s
    const h1Count = headings.filter(h => h.level === 1).length;
    if (h1Count > 1) {
      issues.push({
        type: 'multiple-h1',
        message: `Page has multiple (${h1Count}) top level H1 headings and should have exactly 1`,
      });
    }

    // Check for skipped heading levels
    headings.forEach((heading, index) => {
      if (index > 0) {
        const prevLevel = headings[index - 1].level;
        const prevText = headings[index - 1]?.text;
        const currentLevel = heading.level;
        const currentText = heading?.text;

        if (currentLevel - prevLevel > 1) {
          issues.push({
            type: 'skipped-level',
            message: `Heading level skipped from h${prevLevel} to h${currentLevel}`,
            element: heading.element,
            text: currentText,
            level: currentLevel,
            prevText,
            prevLevel,
          });
        }
      }
    });

    return issues;
  }

  /**
   * Generates a text representation of the heading tree
   * uses spaces to indent the tree for now
   * @param {HeadingNode[]} tree - Heading tree structure
   * @param {number} [indent=0] - Current indentation level
   * @returns {string} Text representation of the tree
   */
  generateTreeText(tree, indent = 0) {
    let result = '';
    const indentStr = '  '.repeat(indent);

    tree.forEach(node => {
      result += `${indentStr}h${node.level} - ${node.text} (${node.source})\n`;
      if (node.children.length) {
        result += this.generateTreeText(node.children, indent + 1);
      }
    });

    return result;
  }
}

export default HeadingHierarchyAnalyzer;
