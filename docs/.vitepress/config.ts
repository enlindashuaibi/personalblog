import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "恩霖大帅逼",
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
            { text: '面试分享', link: '/articles/interview/' },
            { text: 'calico和flannel的区别', link: '/articles/interview/calico2flannel' },
            { text: 'Istio', link: '/articles/interview/Istio' },
            { text: '更新中请期待', link: '/articles/interview/wait' }
          ]
        }
      ],
      '/articles/devops/': [
        {
          text: '运维知识',
          items: [
            { text: '运维知识', link: '/articles/devops/' },
            { text: '更新中请期待', link: '/articles/devops/wait' }
          ]
        }
      ],
      '/articles/troubleshooting/': [
        {
          text: '故障复盘',
          items: [
            { text: '概述', link: '/articles/troubleshooting/' },
            { text: '一次因为阿里云的变更导致的故障', link: '/articles/troubleshooting/anquanzubiangen' },
            { text: '如何安装nvidia-docker', link: '/articles/troubleshooting/installnvidiadocker' },
            { text: '更新中请期待', link: '/articles/troubleshooting/wait' }
          ]
        }
      ]
    }
  }
})