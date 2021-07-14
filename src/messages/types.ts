/**
 * { path: { to: { message: 'text' } } }
 */
export interface Messages {
  [name: string]: Messages | string;
}
