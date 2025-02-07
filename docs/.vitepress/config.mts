// filepath: /d:/git/personalbolg/docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的技术博客",
  description: "分享技术文档和学习心得",
  lang: 'zh-CN',
  base: '/personalblog/',
  // 网站头部导航栏
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '技术分类', 
        items: [
          { text: '前端开发', link: '/articles/frontend/' },
          { text: '后端开发', link: '/articles/backend/' },
          { text: '运维部署', link: '/articles/devops/' }
        ]
      },
      { text: '关于', link: '/about' }
    ],
    
    // 侧边栏
    sidebar: {
      '/articles/frontend/': [
        {
          text: '前端开发',
          items: [
            { text: '分类导航', link: '/articles/frontend/' }
          ]
        }
      ],
      '/articles/backend/': [
        {
          text: '后端开发',
          collapsed: false,
          items: [
            { text: '分类导航', link: '/articles/backend/' }
          ]
        }
      ],
      '/articles/devops/': [
        {
          text: '运维部署',
          collapsed: false,
          items: [
            { text: '分类导航', link: '/articles/devops/' }
          ]
        }
      ]
    },

    // 添加导航配置
    outline: {
      level: [1, 2, 3], // 显示 h1, h2, h3 标题
      label: '页面导航' // 右侧导航栏标题
    },

    // 添加最后更新时间
    lastUpdated: true,

    // 添加页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2024-present'
    },

    // 文档页面设置
  },
  // 引入自定义 CSS
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `@import "/docs/.vitepress/theme/custom.css";`
        }
      }
    }
  }
})