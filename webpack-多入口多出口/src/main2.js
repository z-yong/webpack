import jq from 'jquery'


const app = document.querySelector('#app');
const h2 = document.createElement('h2');
h2.innerHTML = '我是第二个入口文件';
app.appendChild(h2)