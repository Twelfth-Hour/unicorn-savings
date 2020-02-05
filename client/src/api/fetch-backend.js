export const post = async (path, data) => {
  return await fetch(`${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  });
};
