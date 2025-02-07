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
          text: '前端',
          items: [
            { text: '前端概述', link: '/articles/frontend/' }
          ]
        }
      ],
      '/articles/backend/': [
        {
          text: '后端',
          items: [
            { text: '后端概述', link: '/articles/backend/' }
          ]
        }
      ],
      '/articles/devops/': [
        {
          text: '运维',
          items: [
            { text: '概述', link: '/articles/devops/' },
            { text: '一次因为阿里云的变更导致的故障', link: '/articles/devops/anquanzubiangen' },
            { text: '如何安装nvidia-docker', link: '/articles/devops/installnvidiadocker' },
            { text: '更新中请期待', link: '/articles/devops/wait' }
          ]
        }
      ]
    }
  }
})