import app, { connectDatabaseWithRetry } from "../app.js";

export default async function handler(req, res) {
  await connectDatabaseWithRetry();
  return app(req, res);
}
