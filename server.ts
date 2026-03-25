
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Parser from "rss-parser";
import cors from "cors";
import axios from "axios";
import https from "https";

const app = express();
const PORT = 3000;
const parser = new Parser();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

app.use(cors());

// News Sources
const NEWS_SOURCES = [
  { name: "Prothom Alo", url: "https://www.prothomalo.com/feed", avatar: "https://www.prothomalo.com/apple-touch-icon.png" },
  { name: "The Daily Star", url: "https://www.thedailystar.net/rss.xml", avatar: "https://www.thedailystar.net/apple-touch-icon.png" },
  { name: "Dhaka Tribune", url: "https://www.dhakatribune.com/feed/rss", avatar: "https://www.dhakatribune.com/apple-touch-icon.png" },
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", avatar: "https://www.aljazeera.com/favicon.ico" },
  { name: "Reuters", url: "https://www.reuters.com/rssFeed/worldNews", avatar: "https://www.reuters.com/pf/resources/images/reuters/favicon.ico?d=168", skipSSL: true },
  { name: "BTV", url: "https://btv.gov.bd/feed", avatar: "https://btv.gov.bd/themes/btv/logo.png", skipSSL: true },
  { name: "Ekattor TV", url: "https://ekattor.tv/feed", avatar: "https://ekattor.tv/favicon.ico", skipSSL: true },
  { name: "Jamuna TV", url: "https://www.jamuna.tv/feed", avatar: "https://www.jamuna.tv/favicon.ico", skipSSL: true },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", avatar: "https://www.bbc.com/favicon.ico" },
  { name: "CNN", url: "http://rss.cnn.com/rss/cnn_topstories.rss", avatar: "https://edition.cnn.com/favicon.ico" },
  { name: "Somoy News", url: "https://www.somoynews.tv/feed/rss", avatar: "https://www.somoynews.tv/favicon.ico", skipSSL: true },
  { name: "Ittefaq", url: "https://www.ittefaq.com.bd/feed", avatar: "https://www.ittefaq.com.bd/favicon.ico", skipSSL: true },
  { name: "Pinterest", url: "https://www.pinterest.com/officialpinterest/feed.rss", avatar: "https://www.pinterest.com/favicon.ico" }
];

app.get("/api/news", async (req, res) => {
  try {
    const allNews = await Promise.all(
      NEWS_SOURCES.map(async (source) => {
        try {
          // Add a small random delay to avoid simultaneous requests that look like a bot
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
          
          const response = await axios.get(source.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
              'Cache-Control': 'max-age=0'
            },
            httpsAgent: source.skipSSL ? httpsAgent : undefined,
            timeout: 15000
          });
          
          const feed = await parser.parseString(response.data);
          return feed.items.map((item) => {
            // Enhanced image extraction
            let imageUrl = item.enclosure?.url || (item as any).mediaContent?.[0]?.url || null;
            
            if (!imageUrl && item.content) {
              const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }
            
            if (!imageUrl && item.description) {
              const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }
            
            if (!imageUrl && Math.random() > 0.6) {
              imageUrl = `https://picsum.photos/seed/${encodeURIComponent(item.title || 'news')}/800/400`;
            }

            return {
              id: item.guid || item.link,
              author: source.name,
              authorId: source.name.toLowerCase().replace(/\s+/g, "-"),
              avatar: source.avatar,
              content: item.title,
              image: imageUrl,
              timestamp: item.pubDate ? new Date(item.pubDate).toLocaleString("bn-BD") : "এখনই",
              createdAt: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
              reactions: { like: Math.floor(Math.random() * 100), love: Math.floor(Math.random() * 50), care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
              comments: [],
              userReaction: null,
              link: item.link,
              isNews: true
            };
          });
        } catch (e) {
          console.error(`Error fetching from ${source.name}:`, e instanceof Error ? e.message : String(e));
          return [];
        }
      })
    );

    const flattenedNews = allNews.flat();
    
    // Shuffle the news items to provide variety on every refresh
    for (let i = flattenedNews.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flattenedNews[i], flattenedNews[j]] = [flattenedNews[j], flattenedNews[i]];
    }

    res.json(flattenedNews);
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
