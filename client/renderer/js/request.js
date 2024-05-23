import { GRAPHQL_SERVER } from "./constants.js";
const request = async (query, variables) => {
    const response = await fetch(`${GRAPHQL_SERVER}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    return await response.json();
};
const requestNoVar = async (query) => {
    const response = await fetch(`${GRAPHQL_SERVER}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
        }),
    });
    return await response.json();
}

export {
    request,
    requestNoVar
}