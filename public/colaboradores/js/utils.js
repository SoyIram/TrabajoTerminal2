const applicationList = ['aldo', 'alfonso', 'alberto', 'jesus', 'magaly'];

const finder = (string) => {
  const pattern = new RegExp(string);
  const lisToShow = [];
  for(app of applicationList) {
    lisToShow.push(app.match(pattern) ? app : 'No hay coincidencias');
  }
  return lisToShow;
};

const headerFinder = document.getElementById('headerFinder');

headerFinder.addEventListener('change', (event) => {
  console.log(event.detail)
});
