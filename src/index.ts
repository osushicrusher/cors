type Env = {
  NOTION_API_KEY: string;
};

const API_END_POINT = "https://api.notion.com/v1";

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === "OPTIONS") {
      return handleOptions();
    }
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return new Response("Missing Authorization header", { status: 401 });
    }
    // split the auth header to get the Bearer token
    const authToken = authHeader.split(" ")[1];

    // if (authToken !== env.NOTION_API_KEY) {
    //   return new Response("NOTION_API_KEY does not match", { status: 401 });
    // }

    const url = new URL(request.url);
    const requestUrl = `${API_END_POINT}${url.pathname}`;
    const result = await fetch(requestUrl, {
      body: request.body,
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      method: request.method,
    });

    const { body, status, statusText } = result;
    return new Response(body, {
      headers: getCorsHeaders(),
      status,
      statusText,
    });
  },
};

const getCorsHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Notion-Version",
  };
};

function handleOptions() {
  return new Response(null, {
    headers: getCorsHeaders(),
  });
}
