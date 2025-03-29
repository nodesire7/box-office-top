// TMDB API服务
import config from './config.js';

// TMDB API服务类
class TMDBService {
    constructor() {
        this.baseUrl = '/api/tmdb'; // 使用本地代理API
        this.imageBaseUrl = config.tmdbImageBaseUrl;
        this.defaultPosterUrl = config.defaultPosterUrl;
        this.cache = new Map(); // 缓存搜索结果
    }

    // 搜索电影
    async searchMovie(movieName, releaseYear) {
        // 生成缓存键
        const cacheKey = `${movieName}-${releaseYear}`;
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // 构建搜索URL - 使用代理API
            const searchUrl = `${this.baseUrl}/search?query=${encodeURIComponent(movieName)}&year=${releaseYear}&language=zh-CN`;
            
            // 发送请求
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`TMDB API请求失败，状态码：${response.status}`);
            }
            
            const data = await response.json();
            
            // 如果找到结果
            if (data.results && data.results.length > 0) {
                // 获取第一个结果
                const movie = data.results[0];
                // 缓存结果
                this.cache.set(cacheKey, movie);
                return movie;
            }
            
            // 没有找到结果
            return null;
        } catch (error) {
            console.error('搜索电影时出错：', error);
            return null;
        }
    }

    // 获取电影海报URL
    getPosterUrl(posterPath) {
        if (!posterPath) {
            return this.defaultPosterUrl;
        }
        const tmdbUrl = `${this.imageBaseUrl}${posterPath}`;
        return `/api/image-proxy?imageUrl=${encodeURIComponent(tmdbUrl)}`;
    }

    // 根据电影名称和年份获取海报URL
    async getMoviePosterUrlByName(movieName, releaseYear) {
        try {
            const movie = await this.searchMovie(movieName, releaseYear);
            if (movie && movie.poster_path) {
                return this.getPosterUrl(movie.poster_path);
            }
            return this.defaultPosterUrl;
        } catch (error) {
            console.error('获取电影海报时出错：', error);
            return this.defaultPosterUrl;
        }
    }
}

// 创建并导出TMDB服务实例
const tmdbService = new TMDBService();
export default tmdbService;