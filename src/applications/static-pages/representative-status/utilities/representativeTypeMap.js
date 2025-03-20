export const representativeTypeMap = input => {
  const mapping = {
    attorney: 'accredited attorney',
    /* eslint-disable-next-line camelcase */
    claims_agent: 'accredited claims agent',
    /* eslint-disable-next-line camelcase */
    claim_agents: 'accredited claims agent',
    /* eslint-disable-next-line camelcase */
    representative: 'Veteran Service Organization (VSO)',
    /* eslint-disable-next-line camelcase */
    veteran_service_officer: 'Veteran Service Organization (VSO)',
    /* eslint-disable-next-line camelcase */
    organization: 'Veteran Service Organization (VSO)',
  };

  return mapping[input] || input;
};
