export default function handler(req, res) {
    if (req.method === "POST" && req.body) {
        const { user, pass } = req.body;
        if (user === "admin" && pass === "123456") {
            return res.status(200).json({ status: "ok" });
        }
        return res.status(200).json({ status: "error" });
    }

    if (req.method === "GET") {
        return res.status(200).json({ message: "Server working on Vercel!" });
    }

    res.status(405).json({ error: "Method Not Allowed" });
}
