# 🎬 全球票房排行榜 | Global Box Office Rankings

这是一个展示全球电影票房排行榜的网页应用，基于[60s项目](https://github.com/vikiboss/60s)提供的60s电影 API和TMDB API，实时展示电影数据和精美海报。

This is a web application that displays global movie box office rankings, utilizing the 60s Movie API from the [60s Project](https://github.com/vikiboss/60s) and TMDB API to showcase real-time movie data and beautiful posters.

## ✨ 功能特点 | Features

- 🔄 实时显示全球电影票房排行榜 | Real-time global box office rankings
- 🖼️ 使用TMDB API获取高质量电影海报 | High-quality movie posters from TMDB API
- 📱 响应式设计，适配各种设备 | Responsive design for all devices
- ⏱️ 自动定时刷新数据 | Automatic data refresh
- 🔒 后端代理服务器，保护API密钥安全 | Backend proxy server for API key security
- 效果截图

## 🖥️ 效果展示 | Preview

![项目效果展示图](B697233D7B158F786516BDFDD5DBC112.png)

## 🛠️ 技术栈 | Tech Stack

- 🌐 前端 | Frontend：原生JavaScript (ES6+)、HTML5 & CSS3
- 🖥️ 后端 | Backend：Node.js、Express
- 🔌 API：TMDB API、60s项目API (来自[60s项目](https://github.com/vikiboss/60s)) | 60s Movie API (from [60s Project](https://github.com/vikiboss/60s))
- 📦 依赖管理 | Package Management：npm

## 📋 环境要求 | Requirements

- 🟢 Node.js 14.x 或更高版本 | Node.js 14.x or higher
- 📦 npm 6.x 或更高版本 | npm 6.x or higher

## 🚀 安装与使用 | Installation & Usage

### 📝 通用步骤 | General Steps

1. 克隆或下载本项目到本地 | Clone or download this project
   ```bash
   git clone https://github.com/nodesire7/box-office-top.git
   cd box-office-top
   ```

2. 安装依赖 | Install dependencies
   ```bash
   npm install
   ```

3. 创建配置文件 | Create configuration file
   ```bash
   # 创建.env文件并添加TMDB API密钥
   # Create .env file and add TMDB API key
   echo "TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
   PORT=3000
   API_BASE_URL=https://api.example.com" > .env
   ```

4. 启动服务器 | Start server
   ```bash
   npm start
   ```

5. 访问应用 | Access application
   在浏览器中打开 | Open in browser: http://localhost:3000

### 🪟 Windows环境搭建 | Windows Setup

1. 安装Node.js和npm | Install Node.js and npm
   - 访问 | Visit [Node.js官网](https://nodejs.org/)
   - 下载并安装最新LTS版本 | Download and install latest LTS version
   - 安装时勾选自动安装npm和添加到PATH选项 | Select npm installation and PATH addition

2. 按照通用步骤操作 | Follow general steps

### 🐧 Linux环境搭建 | Linux Setup

1. 安装Node.js和npm | Install Node.js and npm
   ```bash
   # 使用nvm安装（推荐）| Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```

2. 按照通用步骤操作 | Follow general steps

3. PM2后台运行（可选）| PM2 background running (optional)
   ```bash
   npm install -g pm2
   pm2 start server.js --name "movie-box-office"
   ```

### 🔧 宝塔面板搭建 | BT Panel Setup

1. 安装Node.js管理器 | Install Node.js manager
2. 创建Node项目 | Create Node project
3. 上传或克隆项目 | Upload or clone project
4. 配置环境变量 | Configure environment variables
5. 设置项目参数 | Set project parameters
   - 项目路径 | Project path
   - 启动文件 | Start file: server.js
   - 端口 | Port: 3000
   - 运行配置 | Runtime config

### 🎯 1Panel面板搭建 | 1Panel Setup

1. 安装Node.js应用 | Install Node.js application
2. 配置项目环境 | Configure project environment
3. 上传项目文件 | Upload project files
4. 配置环境变量 | Configure environment variables
5. 设置应用参数 | Set application parameters

## 🔑 获取TMDB API密钥 | Get TMDB API Key

1. 访问 | Visit [TMDB官网](https://www.themoviedb.org/)
2. 注册并登录 | Register and login
3. 申请API密钥 | Apply for API key
4. 配置项目 | Configure project

## 🙏 致谢 | Acknowledgments

特别感谢[60s项目](https://github.com/vikiboss/60s)提供的电影票房API支持。

Special thanks to the [60s Project](https://github.com/vikiboss/60s) for providing the Maoyan Movie API support.

## 🐳 Docker部署 | Docker Deployment

### 使用Docker Compose部署 | Deploy with Docker Compose

1. 创建环境变量文件 | Create environment file
   ```bash
   # 创建.env文件 | Create .env file
   cat > .env << EOL
   PORT=3000
   API_BASE_URL=your_api_base_url
   TMDB_API_KEY=your_tmdb_api_key
   EOL
   ```

2. 启动服务 | Start service
   ```bash
   docker-compose up -d
   ```

3. 访问应用 | Access application
   在浏览器中打开 | Open in browser: http://localhost:3000

### 使用Docker直接部署 | Deploy with Docker

1. 构建镜像 | Build image
   ```bash
   docker build -t movie-box-office .
   ```

2. 运行容器 | Run container
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e PORT=3000 \
     -e API_BASE_URL=your_api_base_url \
     -e TMDB_API_KEY=your_tmdb_api_key \
     --name movie-box-office \
     movie-box-office
   ```

3. 访问应用 | Access application
   在浏览器中打开 | Open in browser: http://localhost:3000
