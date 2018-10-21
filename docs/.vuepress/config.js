module.exports = {
  title: '资源集成网站',
  description: '分享最有价值的学习资源',
  head: [
    ['link', {
      rel: 'icon',
      href: '/ziyuan.png'
    }]
  ],
  base: '/',
  markdown: {
    lineNumbers: true,
    anchor: {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    },
  },

  //evergreen: true,

  themeConfig: {
    nav: [{
      text: '科学',
      link: '/ziyuan01/'
    }, {
      text: '自学编程',
      link: '/ziyuan02/'
    }, {
      text: '工具',
      link: '/ziyuan03/'
    }, {
      text: '面试',
      link: '/ziyuan04/'
    }, {
      text: '代码仓库',
      link: '/ziyuan05/'
    }, {
      text: '留言',
      link: '/liuyan/liu'
    }, {
      text: '主站',
      link: 'http://cuteximi.com'
    }, {
      text: 'GitHub',
      link: 'https://github.com/aikuyun/ziyuan'
    }, ],
    sidebar: {
      '/ziyuan01/': [
        '', /* /foo/ */
        'ziyuan01', /* /foo/one.html */
        'Polular-Science',
      ],
      '/ziyuan02/': [
        '',
        'coding',
      ],
      '/ziyuan03/': [
        '',
        'Tools'
      ],
      '/ziyuan04/': [
        '',
        'Interview'
      ],
      '/ziyuan05/': [
        '',
        'daimaku'
      ],
      // fallback
      '/': [
        '', /* / */
      ]
    },
    //sidebar: 'auto',
    sidebarDepth: 2,
    displayAllHeaders: true, // 显示所有页面的链接,默认值 false
    search: true, //开启显示搜索框,开箱即用的搜索功能。
    searchMaxSuggestions: 10, //搜索结果的数量
    lastUpdated: '上次更新'
  },

}
