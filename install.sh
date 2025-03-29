#!/bin/bash

# 全球票房排行榜安装脚本
# 此脚本会自动检测系统环境并安装所需依赖

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${BLUE}[信息]${NC} $1"
}

success() {
    echo -e "${GREEN}[成功]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[警告]${NC} $1"
}

error() {
    echo -e "${RED}[错误]${NC} $1"
}

# 检测操作系统类型
detect_os() {
    info "正在检测操作系统类型..."
    
    if [ -f /etc/os-release ]; then
        # Linux系统
        . /etc/os-release
        OS="$ID"
        VERSION="$VERSION_ID"
        success "检测到Linux系统: $OS $VERSION"
    elif [ "$(uname)" == "Darwin" ]; then
        # macOS系统
        OS="macos"
        VERSION="$(sw_vers -productVersion)"
        success "检测到macOS系统: $VERSION"
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
        # Windows Git Bash
        OS="windows-git-bash"
        success "检测到Windows Git Bash环境"
    elif grep -q Microsoft /proc/version 2>/dev/null; then
        # Windows WSL
        OS="windows-wsl"
        success "检测到Windows WSL环境"
    else
        # 未知系统
        error "无法识别的操作系统类型"
        exit 1
    fi
}

# 检查并安装Node.js和npm
install_nodejs() {
    info "检查Node.js和npm是否已安装..."
    
    # 检查Node.js是否已安装
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v)
        success "Node.js已安装: $NODE_VERSION"
    else
        warning "Node.js未安装，正在安装..."
        
        case $OS in
            "ubuntu"|"debian")
                info "使用apt安装Node.js..."
                sudo apt update
                sudo apt install -y nodejs npm
                ;;
            "centos"|"rhel"|"fedora")
                info "使用yum安装Node.js..."
                sudo yum install -y nodejs npm
                ;;
            "macos")
                if command -v brew >/dev/null 2>&1; then
                    info "使用Homebrew安装Node.js..."
                    brew install node
                else
                    warning "Homebrew未安装，正在安装Homebrew..."
                    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                    brew install node
                fi
                ;;
            "windows-git-bash"|"windows-wsl")
                error "请手动安装Node.js: 访问 https://nodejs.org/ 下载并安装"
                exit 1
                ;;
            *)
                error "不支持的操作系统: $OS"
                exit 1
                ;;
        esac
        
        # 验证安装
        if command -v node >/dev/null 2>&1; then
            NODE_VERSION=$(node -v)
            success "Node.js安装成功: $NODE_VERSION"
        else
            error "Node.js安装失败"
            exit 1
        fi
    fi
    
    # 检查npm是否已安装
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm -v)
        success "npm已安装: $NPM_VERSION"
    else
        warning "npm未安装，正在安装..."
        
        case $OS in
            "ubuntu"|"debian")
                sudo apt install -y npm
                ;;
            "centos"|"rhel"|"fedora")
                sudo yum install -y npm
                ;;
            "macos")
                brew install npm
                ;;
            *)
                error "不支持的操作系统: $OS"
                exit 1
                ;;
        esac
        
        # 验证安装
        if command -v npm >/dev/null 2>&1; then
            NPM_VERSION=$(npm -v)
            success "npm安装成功: $NPM_VERSION"
        else
            error "npm安装失败"
            exit 1
        fi
    fi
}

# 安装项目依赖
install_dependencies() {
    info "安装项目依赖..."
    npm install
    
    if [ $? -eq 0 ]; then
        success "项目依赖安装成功"
    else
        error "项目依赖安装失败"
        exit 1
    fi
}

# 配置TMDB API密钥
configure_api_key() {
    info "配置TMDB API密钥..."
    
    # 检查.env文件是否存在
    if [ -f .env ]; then
        warning ".env文件已存在，检查是否包含TMDB API密钥..."
        
        if grep -q "TMDB_API_KEY" .env; then
            success "TMDB API密钥已配置"
            return
        fi
    fi
    
    # 提示用户输入API密钥
    echo -e "\n请输入您的TMDB API密钥（如果没有，请访问 https://www.themoviedb.org/ 注册并申请）："
    read -p "TMDB API密钥: " API_KEY
    
    if [ -z "$API_KEY" ]; then
        warning "未提供API密钥，请访问TMDB官网申请API密钥"
        API_KEY="YOUR_API_KEY_HERE"
    fi
    
    # 创建或更新.env文件
    echo "# TMDB API配置" > .env
    echo "TMDB_API_KEY=$API_KEY" >> .env
    
    success "TMDB API密钥配置完成"
}

# 启动服务
start_service() {
    info "启动服务..."
    
    # 检查是否安装了PM2
    if command -v pm2 >/dev/null 2>&1; then
        info "检测到PM2，使用PM2启动服务..."
        pm2 start server.js --name "movie-box-office"
        success "服务已使用PM2启动，可通过 http://localhost:3000 访问"
        info "使用 'pm2 logs movie-box-office' 查看日志"
        info "使用 'pm2 stop movie-box-office' 停止服务"
    else
        info "使用Node.js启动服务..."
        echo "服务已启动，按Ctrl+C停止"
        echo "可通过 http://localhost:3000 访问"
        node server.js
    fi
}

# 显示面板安装指南
show_panel_guide() {
    echo -e "\n${BLUE}=== 面板安装指南 ===${NC}"
    
    echo -e "\n${YELLOW}宝塔面板安装指南：${NC}"
    echo "1. 在宝塔面板中安装Node.js管理器"
    echo "2. 创建Node项目，选择项目目录和Node版本"
    echo "3. 上传项目文件或使用Git克隆项目到指定目录"
    echo "4. 在项目目录中创建.env文件，添加TMDB API密钥"
    echo "5. 在宝塔Node.js管理器中设置："
    echo "   - 项目路径：选择项目所在目录"
    echo "   - 启动选项：server.js"
    echo "   - 端口：3000（或自定义端口）"
    echo "   - 勾选"是否常驻内存"和"开机启动""
    
    echo -e "\n${YELLOW}1panel面板安装指南：${NC}"
    echo "1. 在1panel应用商店中安装Node.js应用"
    echo "2. 创建网站，配置域名和目录"
    echo "3. 使用1panel的文件管理器上传项目文件或通过终端使用Git克隆项目"
    echo "4. 在项目目录中创建.env文件，添加TMDB API密钥"
    echo "5. 使用1panel的终端功能，进入项目目录安装依赖："
    echo "   cd 项目目录"
    echo "   npm install"
    echo "6. 在1panel的应用管理中创建Node.js应用："
    echo "   - 应用名称：movie-box-office"
    echo "   - 项目目录：选择项目所在目录"
    echo "   - 启动文件：server.js"
    echo "   - 运行端口：3000（或自定义端口）"
    echo "   - 启动命令：node server.js"
    echo "   - 勾选"开机启动"选项"
}

# 主函数
main() {
    echo -e "\n${BLUE}===== 全球票房排行榜安装脚本 =====${NC}\n"
    
    # 检测是否在面板环境中运行
    if [ -f "/www/server/panel/class/panelPlugin.py" ]; then
        warning "检测到宝塔面板环境"
        show_panel_guide
        exit 0
    elif [ -f "/opt/1panel/1panel" ]; then
        warning "检测到1panel面板环境"
        show_panel_guide
        exit 0
    fi
    
    # 检测操作系统
    detect_os
    
    # 安装Node.js和npm
    install_nodejs
    
    # 安装项目依赖
    install_dependencies
    
    # 配置TMDB API密钥
    configure_api_key
    
    # 询问是否启动服务
    echo -e "\n是否立即启动服务？[Y/n]"
    read -p "" START_SERVICE
    
    if [ "$START_SERVICE" = "n" ] || [ "$START_SERVICE" = "N" ]; then
        success "安装完成，您可以稍后使用 'npm start' 或 'node server.js' 启动服务"
    else
        # 启动服务
        start_service
    fi
}

# 执行主函数
main