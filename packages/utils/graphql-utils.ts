export function extractFieldsFromQuery(query: string): string[] {
  const regex = /{\s*([\w\s]+)\s*}/;
  const match = query.match(regex);
  if (match && match[1]) {
    return match[1].trim().split(/\s+/);
  }
  return [];
}
