export const post = async (path, data) => {
  return await fetch(`http://localhost:5000${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  });
};
