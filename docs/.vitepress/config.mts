// filepath: /d:/git/personalbolg/docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "恩霖大帅逼的技术博客",
  description: "日常记录，偶尔更新",
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
          { text: '面试分享', link: '/articles/interview/' },
          { text: '运维知识', link: '/articles/devops/' },
          { text: '故障复盘', link: '/articles/troubleshooting/' }
        ]
      },
      { text: '关于', link: '/about' }
    ],
    
    // 侧边栏
    sidebar: {
      '/articles/interview/': [
        {
          text: '面试分享',
          items: [
            { text: '分类导航', link: '/articles/interview/' }
          ]
        }
      ],
      '/articles/devops/': [
        {
          text: '运维知识',
          collapsed: false,
          items: [
            { text: '分类导航', link: '/articles/devops/' }
          ]
        }
      ],
      '/articles/troubleshooting/': [
        {
          text: '故障复盘',
          collapsed: false,
          items: [
            { text: '分类导航', link: '/articles/troubleshooting/' }
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