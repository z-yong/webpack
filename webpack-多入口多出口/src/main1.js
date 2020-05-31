import jq from 'jquery'

const app = document.querySelector('#app');
const h1 = document.createElement('h1');
h1.innerHTML = '我是第一个入口文件';
app.appendChild(h1)