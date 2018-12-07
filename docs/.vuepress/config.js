module.exports = {
  title: '大数据进击之路',
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
      text: '大数据生态',
      link: '/ziyuan01/'
    }, {
      text: '深挖底层',
      link: '/ziyuan02/'
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
      ],
      '/ziyuan02/': [
        '', /* /foo/ */
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
