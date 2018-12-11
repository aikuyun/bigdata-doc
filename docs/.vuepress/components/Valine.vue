<template>
  <div id="vcomments"></div>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function(){
    // require window
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      this.window = window
      window.AV = require('leancloud-storage')

    }

    new Valine({
      el: '#vcomments' ,
      appId: 'dvlWXb6HYmur6ivfGoBA8rhH-gzGzoHsz',// your appId
      appKey: 'cPlgoTRcS9mMVltx8Fw7F9lv', // your appKey
      notify:false,
      verify:false,
      avatar:'mm',
      placeholder: 'just go go'
    });
  },
}
</script>
