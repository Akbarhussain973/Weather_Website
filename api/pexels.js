export default async function handler(req, res) {
  const { query, page = 1 } = req.query;

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      },
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch images",
    });
  }
}
