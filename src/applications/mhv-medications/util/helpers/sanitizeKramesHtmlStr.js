/**
 * This function sanitizes the input how we want it displayed when
 * receiving the HTML string from the Krames API
 *
 * @param {String} htmlString - HTML string from the Krames API
 */
export const sanitizeKramesHtmlStr = htmlString => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;

  // This section is to address removing <body> and <page> tags
  if (tempDiv.querySelector('body')) {
    tempDiv.innerHTML = tempDiv.querySelector('body').innerHTML;
  }
  if (tempDiv.querySelector('page')) {
    tempDiv.innerHTML = tempDiv.querySelector('page').innerHTML;
  }

  // This section is to address removing <h1> tags
  tempDiv.querySelectorAll('h1').forEach(h1 => {
    const h2 = document.createElement('h2');
    h2.innerHTML = h1.innerHTML;
    h1.replaceWith(h2);
  });

  // This section is to address <h3> tags coming before <h2> tags
  tempDiv.querySelectorAll('h3').forEach(h3 => {
    let sibling = h3.nextElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === 'h2') {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = h3.innerHTML;
        h3.replaceWith(paragraph);
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  });

  const processUl = ul => {
    const nestedUls = ul.querySelectorAll('ul');

    // This section is to address nested <ul> tags
    nestedUls.forEach(nestedUl => {
      while (nestedUl.firstChild) {
        ul.appendChild(nestedUl.firstChild);
      }
      nestedUl.remove();
    });

    // This section is to address <p> tags inside of <ul> tags
    const pTags = ul.querySelectorAll('p');
    pTags.forEach(pTag => {
      const fragmentBefore = document.createDocumentFragment(); // Fragment to hold nodes before <p> tag
      const fragmentAfter = document.createDocumentFragment(); // Fragment to hold nodes after <p> tag
      let isBefore = true;

      Array.from(ul.childNodes).forEach(child => {
        if (child === pTag) {
          isBefore = false;
          return;
        }

        if (isBefore) {
          // Add non-empty nodes before <p> tag to fragmentBefore
          if (
            child.nodeType !== Node.TEXT_NODE ||
            child.textContent.trim().length > 0
          ) {
            fragmentBefore.appendChild(child.cloneNode(true));
          }
        } else if (
          // Add non-empty nodes after <p> tag to fragmentAfter
          child.nodeType !== Node.TEXT_NODE ||
          child.textContent.trim().length > 0
        ) {
          fragmentAfter.appendChild(child.cloneNode(true));
        }
      });

      // If there are nodes before <p> tag, create new <ul> and insert it
      if (fragmentBefore.childNodes.length > 0) {
        const newUlBefore = document.createElement('ul');
        while (fragmentBefore.firstChild) {
          newUlBefore.appendChild(fragmentBefore.firstChild);
        }
        if (ul.parentNode) {
          ul.parentNode.insertBefore(newUlBefore, ul);
        }
      }

      // Insert <p> tag before the original <ul>
      if (ul.parentNode) {
        ul.parentNode.insertBefore(pTag, ul);
      }

      // If there are nodes after <p> tag, create new <ul> and insert it
      if (fragmentAfter.childNodes.length > 0) {
        const newUlAfter = document.createElement('ul');
        while (fragmentAfter.firstChild) {
          newUlAfter.appendChild(fragmentAfter.firstChild);
        }
        if (ul.parentNode) {
          ul.parentNode.insertBefore(newUlAfter, ul);
        }
      }

      ul.remove();
    });
  };

  tempDiv.querySelectorAll('ul').forEach(processUl);

  // This section is to address all caps text inside of <h2> tags
  tempDiv.querySelectorAll('h2').forEach(heading => {
    const h2 = document.createElement('h2');
    let words = heading.textContent.toLowerCase().split(' ');
    words = words.map((word, index) => {
      if (index === 0 || word === 'i') {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
    h2.textContent = words.join(' ');
    h2.setAttribute('id', h2.textContent);
    h2.setAttribute('tabindex', '-1');
    heading.replaceWith(h2);
  });

  // This section is to address text with no tags
  Array.from(tempDiv.childNodes).forEach(node => {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.textContent.trim().length > 0
    ) {
      const paragraph = document.createElement('p');
      paragraph.textContent = node.textContent;
      node.replaceWith(paragraph);
    }
  });

  // This section is to address all table tags and add role="presentation" to them
  tempDiv.querySelectorAll('table').forEach(table => {
    table.setAttribute('role', 'presentation');
  });

  // this section is to address strong tags
  tempDiv.querySelectorAll('strong').forEach(strong => {
    const parent = strong.parentNode;
    while (strong.firstChild) {
      parent.insertBefore(strong.firstChild, strong);
    }
    strong.remove();
  });

  // This section to address the pilcrow characters and replace with asterisks
  const removePilcrowRecursive = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      if (parent) {
        const newNode = document.createTextNode(
          node.textContent.replace(/¶/g, '*').trimStart(),
        );
        parent.replaceChild(newNode, node);
      }
    } else {
      node.childNodes.forEach(child => removePilcrowRecursive(child));
    }
  };

  removePilcrowRecursive(tempDiv);

  return tempDiv.innerHTML;
};
