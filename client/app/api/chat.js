export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: req.body.message }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
