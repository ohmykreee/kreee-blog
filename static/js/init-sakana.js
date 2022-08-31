var loadSakanaWidget = () => {
  import('/js/sakana-widget/sakana.min.js')
    .then(() => {
      const sakanaDiv = document.createElement('div')
      sakanaDiv.setAttribute('id', 'sakana-widget')
      sakanaDiv.style.cssText = 'position:fixed;bottom:5px;left:0;z-index:10;'
      document.body.insertBefore(sakanaDiv, document.body.firstChild)
      new SakanaWidget().mount('#sakana-widget')
    })
}

if (window.matchMedia("(min-width: 800px)").matches) {
  loadSakanaWidget()
} else {
  if (document.getElementById('ifLoadSakna')) {
    const loaderDiv = document.getElementById('ifLoadSakna')
    const loaderA = document.createElement('a')
    loaderA.innerHTML = '点此加载左下角的小组件...'
    loaderA.setAttribute('href','#')
    loaderA.setAttribute('onclick', `loadSakanaWidget();document.getElementById('ifLoadSakna').remove();return false;`)
    loaderDiv.appendChild(loaderA)
  }
}