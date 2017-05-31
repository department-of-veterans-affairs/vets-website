import {} from './axeCheck';

export function command(context) {
  const config = { rules: ['section508', 'wcag2a'] };
  return this.axeCheck(context, config);
}
