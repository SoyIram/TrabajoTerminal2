const applicationList = [
  {name: 'Zoom', href: 'https://us06web.zoom.us/meeting#/upcoming', img: './img/zoom.png'},
  {name: 'BrightSpace', href: 'https://saeonline.mx/adfs/ls/?SAMLRequest=jdG9asMwEADgvdB3MNptSZYT28IOhHYJpEvSduhSztYlMdiSq5NLHr9OQ0qhS7f74eC7u2o9hZPd4ceEFKLNY80Iht5f8%2fdCNXkOBhrIiwxL06BclsYsGpDZMisPLHpFT52zNUsTwaIN0YQbSwFsmEsiVbGQsSifU6XlQguRlEuplJRvLFoToQ%2fz7IOzNA3o9%2bg%2fuxZfdtuanUIYSXNOgAOeu9Ylje%2bOp0AjtJi0buAm7Xk%2fcpj5vHfHzvILfHuJkrnHovPQW6rZ5K12QB1pCwOSDq3er5%2b2evbq0bvgWtez1f1dFFXfev%2bfQbjZ2eomLcEYeQCMTS5FnOXFIm4K1cZZgyo1hVACsiSgnS9Df5b5oVf8iphBFf%2f9mtUX&RelayState=%2fd2l%2fhome', img: './img/brightspace.png'},
  {name: 'Moodle', href: 'https://moodle.org/?lang=es', img: './img/moodle.png'},
  {name: 'Edublogs', href: 'https://edublogs.org', img: './img/edublogs.jpeg'},
  {name: 'Canvas', href: 'https://www.canva.com/es_419/', img: './img/canvas.png'}
];
const list = document.querySelector('#listOptions');
const headerFinder = document.getElementById('headerFinder');

const finder = (string) => {
  const pattern = new RegExp(string.toLowerCase());
  let lisToShow = [];
  for(let app of applicationList) {
    if(app.name.toLowerCase().match(pattern)) {
      lisToShow.push(app);
    }

  }
  lisToShow = removeDuplicates(lisToShow);
  return lisToShow;
};

const removeDuplicates = (arr) => {
  return arr.filter((item, index) => item !== '' && arr.indexOf(item) === index);
}

headerFinder.addEventListener('input', (event) => {
  if(event.target.value.length > 1) {
    const options = finder(headerFinder.value);
    list.innerHTML = '';
    options.forEach(option => {
      const link = document.createElement('a');
      link.href = option.href;
      link.innerText = option.name;
      const img = document.createElement('img');
      img.src = option.img;
      const div = document.createElement('div');
      div.className = 'flex';
      div.appendChild(img);
      div.appendChild(link);
      const li = document.createElement('li');
      li.className = 'search-list-item';
      li.appendChild(div);
      list.appendChild(li);
    });
  } else {
    list.innerHTML = '';
  }
});
