import get from 'lodash/get';
import { messages } from '../messages/en';

export function getMessage(messagePath: string): string {
  const m = get(messages, messagePath) as string;
  if (process.env.NODE_ENV !== 'production' && typeof m !== 'string') {
    console.error(
      `Tried to get the default message for ${messagePath}, but it wasn't a string. Check to make sure the path is correct and the message is available in the language you're using.`
    );
  }
  return m;
}
