# 小灯控制系统 - React + Vite 版本

## 项目概述

这是一个使用 React 和 Vite 构建的小灯控制面板应用，提供现代化的用户界面来管理 IoT 设备（LED 灯）。

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 5
- **UI 库**: React DOM
- **开发服务器**: Vite Dev Server

## 功能特性

### 页面 1: 小灯控制系统 (/)
- ✅ 电源开关控制
- ✅ 亮度调节 (0-100%)
- ✅ RGB 颜色选择器
- ✅ 多种闪烁模式 (常亮、慢闪、快闪、频闪、呼吸灯)
- ✅ 实时状态显示

### 页面 2: PID 参数控制 (/pid)
- ✅ 比例系数 (Kp) 调节
- ✅ 积分系数 (Ki) 调节
- ✅ 微分系数 (Kd) 调节
- ✅ 目标值设置
- ✅ 采样时间配置
- ✅ 参数应用与重置

### 通用功能
- ✅ 响应式设计，支持移动端
- ✅ 页面导航切换
- ✅ 与后端 API 通信

## 项目结构

```
frontend - react/
├── src/                      # 源代码目录
│   ├── index.jsx             # React 入口文件
│   ├── App.jsx               # 主应用组件（路由配置）
│   ├── LightControl.jsx      # 小灯控制页面组件
│   ├── PidControl.jsx        # PID 控制页面组件
│   ├── Navigation.jsx        # 导航栏组件
│   ├── Navigation.css        # 导航栏样式
│   └── style.css             # 全局样式文件
├── .env                      # 环境变量配置
├── index.html                # HTML 模板
├── vite.config.js            # Vite 配置文件
├── package.json              # 项目依赖和脚本命令
└── node_modules/             # 依赖包目录
```

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

编辑 `.env` 文件，设置后端 API 地址：

```env
VITE_API_BASE_URL=http://localhost:3000
```

**注意**: 修改 `.env` 文件后需要重启开发服务器。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:8080

### 4. 生产构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

## 环境变量配置

项目使用 Vite 的环境变量系统，所有自定义环境变量必须以 `VITE_` 开头。

### 当前配置

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | 后端 API 基础 URL |

### 使用方法

在代码中通过 `import.meta.env` 访问：

```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
```

### 多环境配置

可以创建不同环境的配置文件：

- `.env` - 所有环境通用
- `.env.development` - 开发环境
- `.env.production` - 生产环境

## 页面路由

项目使用 React Router 实现多页面导航：

### 路由配置

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 小灯控制系统 | 灯光控制面板（首页） |
| `/pid` | PID 参数控制 | PID 参数配置面板 |

### 导航使用

顶部导航栏提供页面切换功能：
- 🔆 **小灯控制** - 切换到灯光控制页面
- ⚙️ **PID参数** - 切换到 PID 参数页面

当前激活的页面会在导航栏中高亮显示。

## 后端 API

确保后端服务运行在配置的 URL 上，提供以下接口：

### 小灯控制 API
- `GET /health` - 健康检查
- `GET /api/led/status` - 获取 LED 状态
- `POST /api/led/status` - 设置 LED 状态

### PID 控制 API
- `POST /api/pid` - 设置 PID 参数

请求格式示例：
```json
{
  "kp": 1.0,
  "ki": 0.1,
  "kd": 0.01,
  "targetValue": 100,
  "sampleTime": 0.1
}
```

## 开发注意事项

1. **文件命名**: 包含 JSX 语法的文件必须使用 `.jsx` 或 `.tsx` 后缀
2. **模块类型**: package.json 中设置了 `"type": "module"`
3. **端口配置**: 开发服务器默认运行在 8080 端口
4. **环境变量**: 修改 `.env` 后需重启开发服务器

## License

ISC
