export function bodyParser(body: string | undefined) {
  return JSON.parse(body || '{}');
}
