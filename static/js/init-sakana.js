var loadSakanaWidget = () => {
  import('/js/sakana-widget/sakana.min.js')
    .then(() => {
      const sakanaDiv = document.createElement('div')
      sakanaDiv.setAttribute('id', 'sakana-widget')
      sakanaDiv.style.cssText = 'position:fixed;bottom:5px;left:0;z-index:10;'
      document.body.insertBefore(sakanaDiv, document.body.firstChild)
      const SakanaWidgetClass = new SakanaWidget()
      SakanaWidgetClass.mount('#sakana-widget')
      addEventListener('unload', () => {
        SakanaWidgetClass.unmount()
      })
    })
}

if (window.matchMedia("(min-width: 800px)").matches) {
  loadSakanaWidget()
} else {
  if (document.getElementById('ifLoadSakana')) {
    const loaderDiv = document.getElementById('ifLoadSakana')
    const loaderA = document.createElement('a')
    loaderA.innerHTML = '点此加载左下角的小组件...'
    loaderA.setAttribute('href','#')
    loaderA.setAttribute('onclick', `loadSakanaWidget();document.getElementById('ifLoadSakana').remove();return false;`)
    loaderDiv.appendChild(loaderA)
  }
}