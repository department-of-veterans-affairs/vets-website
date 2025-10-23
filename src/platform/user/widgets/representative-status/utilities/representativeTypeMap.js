/* eslint-disable camelcase */

export const representativeTypeMap = input => {
  const mapping = {
    attorney: 'accredited attorney',
    claims_agent: 'accredited claims agent',
    claim_agents: 'accredited claims agent',
    representative: 'Veteran Service Organization (VSO)',
    veteran_service_officer: 'Veteran Service Organization (VSO)',
    organization: 'Veteran Service Organization (VSO)',
  };

  return mapping[input] || input;
};
