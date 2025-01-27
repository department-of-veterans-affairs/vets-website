/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { useGetProviderById } from '../../../hooks/useGetProviderById';

export default function TestComponent({ providerId }) {
  const { provider, loading, failed } = useGetProviderById(providerId);
  return (
    <div data-testid="test-component">
      <p>Test component</p>
      <p data-testid="provider-name">{`name: ${provider?.providerName}`}</p>
      <p data-testid="provider-id">{`id: ${provider?.id}`}</p>
      <p data-testid="loading">{`loading: ${loading}`}</p>
      <p data-testid="fail-status">{`fail status: ${failed}`}</p>
    </div>
  );
}

TestComponent.propTypes = {
  providerId: PropTypes.string,
};
