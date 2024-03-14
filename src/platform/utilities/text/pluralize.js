const rules = {
  '(quiz)$': '$1zes',
  '(x|ch|ss|sh)$': '$1es',
  '([^aeiouy]|qu)y$': '$1ies',
  '(?:([^f])fe|([lr])f)$': '$1$2ves',
  sis$: 'ses',
  '([ti])um$': '$1a',
  '(bu)s$': '$1ses',
  '(alias)$': '$1es',
  '(ax|test)is$': '$1es',
  '(us)$': '$1es',
};

const irregulars = {
  person: 'people',
  child: 'children',
};

const uncountable = ['series', 'money', 'information', 'equipment'];

/**
 * Pluralizes a singular noun.
 *
 * Example:
 * ```
 * const pluralNoun = pluralize('person')
 * // pluralNoun === 'people'
 * ```
 */
export default function pluralize(nounSingular) {
  if (!nounSingular) {
    return nounSingular;
  }

  if (uncountable.includes(nounSingular)) {
    return nounSingular;
  }

  if (irregulars[nounSingular]) {
    return irregulars[nounSingular];
  }

  for (const [rule, replacement] of Object.entries(rules)) {
    const pattern = new RegExp(rule, 'i');
    if (pattern.test(nounSingular)) {
      return nounSingular.replace(pattern, replacement);
    }
  }

  return `${nounSingular}s`;
}
