import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { apiRequest } from 'platform/utilities/api';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
}

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

export const fillDataWithRtl = ({
  container,
  inputs,
  useUserEvent = false,
}) => {
  if (Array.isArray(inputs) && inputs?.length) {
    inputs.forEach(({ target, value }) => {
      const element = container.querySelector(target);
      fireEvent.change(element, { target: { value } });
    });
  } else if (typeof inputs === 'object') {
    Object.entries(inputs).forEach(([inputTarget, inputValue]) => {
      const element = container.querySelector(inputTarget);
      if (!element) {
        throw new Error(
          `Could not find elment ${inputTarget}. Try running screen.debug()`,
        );
      }

      fireEvent.change(element, { target: { value: inputValue } });
    });
  } else if (useUserEvent) {
    userEvent.click(container.querySelector(inputs));
  }
};
