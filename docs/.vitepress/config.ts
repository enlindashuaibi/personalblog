import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的技术博客",
  description: "分享技术文档和学习心得",
  lang: 'zh-CN',
  
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
            { text: '前端概述', link: '/articles/frontend/' }
          ]
        }
      ],
      '/articles/backend/': [
        {
          text: '后端开发',
          items: [
            { text: '后端概述', link: '/articles/backend/' }
          ]
        }
      ],
      '/articles/devops/': [
        {
          text: '运维部署',
          items: [
            { text: '运维概述', link: '/articles/devops/' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名' }
    ]
  }
})