import createClient from "openapi-fetch";
import { paths } from "./schema";

const client = createClient<paths>({
  baseUrl: "http://localhost:8080",
});

export default client;
