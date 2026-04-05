export function isValidAdminKey(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const received = request.headers.get("x-admin-key");

  return Boolean(expected && received && received === expected);
}