// 后端代理服务器
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 从环境变量中获取API密钥
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// 启用CORS
app.use(cors());

// 提供静态文件
app.use(express.static(path.join(__dirname, '/')));

// 确保images目录存在
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// 图片代理和缓存
app.get('/api/image-proxy', async (req, res) => {
    try {
        const { imageUrl } = req.query;
        
        if (!imageUrl) {
            return res.status(400).json({ error: '缺少图片URL参数' });
        }

        // 生成图片文件名
        const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
        const ext = path.extname(imageUrl) || '.jpg';
        const filename = hash + ext;
        const localPath = path.join(imagesDir, filename);

        // 检查本地缓存
        if (fs.existsSync(localPath)) {
            return res.sendFile(localPath);
        }

        // 下载图片
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`图片下载失败，状态码：${response.status}`);
        }

        // 保存图片
        const buffer = await response.buffer();
        fs.writeFileSync(localPath, buffer);

        // 返回图片
        res.sendFile(localPath);
    } catch (error) {
        console.error('图片代理错误:', error);
        res.status(500).json({ error: '图片处理失败' });
    }
});

// TMDB API代理端点
app.get('/api/tmdb/search', async (req, res) => {
    try {
        const { query, year, language = 'zh-CN' } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: '缺少查询参数' });
        }
        
        // 构建TMDB API URL
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&year=${year}&language=${language}`;
        
        // 发送请求到TMDB
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`TMDB API请求失败，状态码：${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('TMDB API代理错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 猫眼API代理端点
app.get('/api/maoyan', async (req, res) => {
    try {
        const response = await fetch('https://60s-api.viki.moe/v2/maoyan');
        
        if (!response.ok) {
            throw new Error(`猫眼API请求失败，状态码：${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('猫眼API代理错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});