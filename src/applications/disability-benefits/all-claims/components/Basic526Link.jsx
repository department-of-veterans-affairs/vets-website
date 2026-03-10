import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const RETURN_PATH_KEY_PREFIX = 'disability-526-return-paths';

/**
 * Builds the sessionStorage key for a given group.
 * When no group is provided, uses the shared default key.
 *
 * @param {string} [group] - Optional group name for isolated stacks
 * @returns {string} The sessionStorage key
 */
const getStorageKey = group =>
  group ? `${RETURN_PATH_KEY_PREFIX}-${group}` : RETURN_PATH_KEY_PREFIX;

/**
 * Reads the return-path stack from sessionStorage for a given group.
 * A stack is used so that nested links (Page A -> Page B -> Page C) correctly
 * unwind: Continue on C returns to B, Continue on B returns to A.
 *
 * An optional `group` parameter isolates stacks so different groups of pages
 * don't interfere with each other. When omitted, all links share a single
 * default stack.
 *
 * @param {string} [group] - Optional group name for isolated stacks
 * @returns {string[]} The current stack of return paths
 */
const getReturnPathStack = group => {
  try {
    return JSON.parse(sessionStorage.getItem(getStorageKey(group))) || [];
  } catch {
    return [];
  }
};

/**
 * Pushes a return path onto the stack in sessionStorage.
 *
 * @param {string} path - The path to push onto the stack
 * @param {string} [group] - Optional group name for isolated stacks
 */
export const pushReturnPath = (path, group) => {
  const key = getStorageKey(group);
  const stack = getReturnPathStack(group);
  stack.push(path);
  sessionStorage.setItem(key, JSON.stringify(stack));
};

/**
 * Pops the most recent return path from the stack in sessionStorage.
 * Removes the sessionStorage key entirely when the stack is empty.
 *
 * @param {string} [group] - Optional group name for isolated stacks
 * @returns {string|null} The most recent return path, or null if the stack is empty
 */
export const popReturnPath = group => {
  const key = getStorageKey(group);
  const stack = getReturnPathStack(group);
  if (stack.length === 0) return null;
  const path = stack.pop();
  if (stack.length === 0) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, JSON.stringify(stack));
  }
  return path;
};

/**
 * A link component for the 526 form that pushes the current page path onto
 * a return-path stack in sessionStorage before navigating to the target page.
 * When paired with `onNavForwardToReturnPath` (or `withReturnPath`) on the
 * target page's config, clicking Continue on the target page returns the user
 * to the page they came from. Supports nested links — each Continue pops
 * the most recent return path from the stack.
 *
 * Pass an optional `group` prop to isolate the return-path stack from other
 * groups. Both the link and the target page's handler must use the same group.
 *
 * @param {object} props - React component props
 * @param {string} props.path - The form page path to navigate to
 * @param {string} [props.group] - Optional group name for isolated stacks
 * @param {object} props.router - Injected by withRouter
 * @param {string} [props.aria-label] - Accessible label for the link
 * @param {string} [props.text] - Display text for the va-link
 * @returns {JSX.Element} A va-link web component with return-path navigation
 *
 * @example
 * // Default shared stack:
 * <Basic526Link
 *   path="supporting-evidence/separation-health-assessment"
 *   text="Check if you've uploaded a SHA Part A document"
 * />
 *
 * @example
 * // Isolated group:
 * <Basic526Link
 *   group="sha"
 *   path="supporting-evidence/separation-health-assessment"
 *   text="Check if you've uploaded a SHA Part A document"
 * />
 *
 * @example
 * // Target page config:
 * import { onNavForwardToReturnPath } from '../components/Basic526Link';
 * // default: { onNavForward: onNavForwardToReturnPath() }
 * // grouped: { onNavForward: onNavForwardToReturnPath('sha') }
 */
const Basic526Link = ({ path, group, router, ...props }) => {
  const ariaLabel = props?.['aria-label'] ?? {};
  const href = path.charAt(0) === '/' ? path : `/${path}`;

  return (
    <VaLink
      {...props}
      href={href}
      label={ariaLabel}
      onClick={event => {
        event.preventDefault();
        pushReturnPath(router.location.pathname, group);
        router.push(path);
      }}
    />
  );
};

Basic526Link.propTypes = {
  'aria-label': PropTypes.string,
  group: PropTypes.string,
  path: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }),
};

export default withRouter(Basic526Link);

/**
 * Creates an onNavForward handler for pages reachable via Basic526Link.
 * Pops the most recent return path from the stack. If one exists, navigates
 * there. Otherwise proceeds to the next sequential page.
 *
 * @param {string} [group] - Must match the `group` prop on the corresponding Basic526Link
 * @returns {Function} An onNavForward handler
 *
 * Usage in page config:
 *   { onNavForward: onNavForwardToReturnPath() }         // default stack
 *   { onNavForward: onNavForwardToReturnPath('sha') }    // grouped stack
 */
export const onNavForwardToReturnPath = group => ({ goPath, goNextPath }) => {
  const returnPath = popReturnPath(group);
  if (returnPath) {
    goPath(returnPath);
  } else {
    goNextPath();
  }
};

/**
 * Higher-order function that wraps an existing onNavForward handler.
 * If a return path is on the stack, pops and navigates there.
 * Otherwise delegates to the wrapped handler.
 *
 * @param {Function} wrappedOnNavForward - The existing onNavForward to compose with
 * @param {string} [group] - Must match the `group` prop on the corresponding Basic526Link
 * @returns {Function} A new onNavForward handler
 *
 * Usage in page config:
 *   { onNavForward: withReturnPath(existingHandler) }          // default stack
 *   { onNavForward: withReturnPath(existingHandler, 'sha') }   // grouped stack
 */
export const withReturnPath = (wrappedOnNavForward, group) => props => {
  const returnPath = popReturnPath(group);
  if (returnPath) {
    props.goPath(returnPath);
  } else {
    wrappedOnNavForward(props);
  }
};
