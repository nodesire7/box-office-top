// 后端代理服务器
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');

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