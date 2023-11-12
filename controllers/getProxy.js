const getProxyForUrl = (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.json({ error: 'Missing required parameter `url`' });
        return;
    }
    else if (!url.startsWith('http')) {
        res.json({ error: 'Invalid URL' });
        return;
    }
    const proxy = process.env.PROXY_URL;
    const proxyUrl = `${proxy}${url}`;
    res.json({ proxyUrl });
}