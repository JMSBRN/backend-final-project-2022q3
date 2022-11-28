export function createError(statusCode: number, message: string) {
  return { statusCode, message };
}

export function checkBody(body: object, keys: string[]): string | null {
  const bodyKeys = Object.keys(body);
  if (bodyKeys.length === 0) {
    return 'body is required';
  }
  for (const key of keys) {
    if (!body.hasOwnProperty(key)) {
      return `${key} is required`;
    }
  }
  if (bodyKeys.length > keys.length) {
    const extraProps = bodyKeys.filter(prop => !keys.includes(prop));
    return `properties [ ${extraProps.join(',')} ] shouldn't exist`
  }
  return null;
}