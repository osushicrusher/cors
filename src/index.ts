const API_END_POINT = "https://api.notion.com/v1";

export default {
  async fetch(request: Request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401 });
    }
    // split the auth header to get the Bearer token
    const authToken = authHeader.split(" ")[1];
    const url = new URL(request.url);
    const requestUrl = `${API_END_POINT}${url.pathname}`;
    const result = await fetch(requestUrl, {
      body: request.body,
      headers: {
        Authorization: "Bearer " + authToken,
        "Notion-Version": "2022-06-28",
      },
      method: request.method,
    });

    const { body, status, statusText } = result;
    return new Response(body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      status,
      statusText,
    });
  },
};
