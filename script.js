// 导入TMDB服务
import tmdbService from './tmdb-service.js';

// API 地址 - 使用本地代理
const apiUrl = "/api/maoyan";

// 获取 DOM 元素
const movieList = document.getElementById("movie-list");
const updateTimeElement = document.getElementById("update-time");

// 存储电影海报URL的缓存
const posterCache = new Map();

// 从 API 获取数据并更新页面
async function fetchMovieData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }
        const data = await response.json();
        const movies = data.data.list;
        const updateTime = data.data.update_time;

        // 更新页面内容
        updateTimeElement.textContent = updateTime;
        renderMovieList(movies);
    } catch (error) {
        console.error("获取数据时出错：", error);
        movieList.innerHTML = "<p style='text-align: center;'>加载失败，请稍后再试。</p>";
    }
}

// 获取电影封面URL
async function getMoviePosterUrl(movieId, movieName, releaseYear) {
    // 首先尝试使用TMDB API获取海报
    try {
        // 检查缓存
        const cacheKey = `${movieName}-${releaseYear}`;
        if (posterCache.has(cacheKey)) {
            return posterCache.get(cacheKey);
        }
        
        // 使用TMDB API获取海报
        const posterUrl = await tmdbService.getMoviePosterUrlByName(movieName, releaseYear);
        
        // 缓存结果
        posterCache.set(cacheKey, posterUrl);
        return posterUrl;
    } catch (error) {
        console.error('获取TMDB海报时出错：', error);
        
        // 如果TMDB API失败，回退到猫眼海报
        // 如果没有电影ID，返回默认图片
        if (!movieId) return tmdbService.defaultPosterUrl;
        
        // 根据猫眼电影ID构建不同的封面URL
        return `https://p0.meituan.net/movie/${movieId}.jpg@160w_220h_1e_1c`;
    }
}

// 渲染电影列表
function renderMovieList(movies) {
    movieList.innerHTML = ""; // 清空之前的列表
    movies.forEach(movie => {
        const { rank, movie_name, release_year, box_office_desc, maoyan_id } = movie;

        // 创建电影卡片
        const card = document.createElement("div");
        card.className = "movie-card";

        // 排名
        const rankSpan = document.createElement("span");
        rankSpan.className = "rank";
        rankSpan.textContent = rank;

        // 电影封面
        const posterDiv = document.createElement("div");
        posterDiv.className = "movie-poster";
        const posterImg = document.createElement("img");
        posterImg.className = "poster-img";
        posterImg.src = tmdbService.defaultPosterUrl; // 先设置默认图片
        posterImg.alt = `${movie_name} 海报`;
        posterImg.loading = "lazy"; // 懒加载
        posterDiv.appendChild(posterImg);
        
        // 异步加载海报
        getMoviePosterUrl(maoyan_id, movie_name, release_year).then(url => {
            posterImg.src = url;
        });

        // 电影信息容器
        const infoDiv = document.createElement("div");
        infoDiv.className = "movie-info";

        // 电影名称
        const nameDiv = document.createElement("div");
        nameDiv.className = "movie-name";
        nameDiv.textContent = movie_name;

        // 上映年份
        const yearDiv = document.createElement("div");
        yearDiv.className = "release-year";
        yearDiv.textContent = `上映年份：${release_year}`;

        // 票房
        const boxOfficeDiv = document.createElement("div");
        boxOfficeDiv.className = "box-office";
        boxOfficeDiv.textContent = box_office_desc;

        // 组装电影信息
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(yearDiv);

        // 组装卡片
        card.appendChild(rankSpan);
        card.appendChild(posterDiv);
        card.appendChild(infoDiv);
        card.appendChild(boxOfficeDiv);

        // 添加到电影列表
        movieList.appendChild(card);
    });
}

// 页面加载时获取数据
window.addEventListener("DOMContentLoaded", () => {
    fetchMovieData();

    // 每隔 5 分钟刷新一次数据（可选）
    setInterval(fetchMovieData, 5 * 60 * 1000);
});