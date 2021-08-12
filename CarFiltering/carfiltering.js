document.addEventListener('DOMContentLoaded', () => {
  const filtersDiv = document.querySelector('#filters');
  const carPartial = document.querySelector('#car_partial');
  const carsTemplate = document.querySelector('#cars_template');
  const carsDiv = document.querySelector('#cars');
  const filterButton = document.querySelector('.filter_btn');

  const carManager = (function () {
    const cars = [
      { make: 'Honda', image: 'images/honda-accord-2005.jpg', model: 'Accord', year: 2005, price: 7000 },
      { make: 'Honda', image: 'images/honda-accord-2008.jpg', model: 'Accord', year: 2008, price: 11000 },
      { make: 'Toyota', image: 'images/toyota-camry-2009.jpg', model: 'Camry', year: 2009, price: 12500 },
      { make: 'Toyota', image: 'images/toyota-corrolla-2016.jpg', model: 'Corolla', year: 2016, price: 15000 },
      { make: 'Suzuki', image: 'images/suzuki-swift-2014.jpg', model: 'Swift', year: 2014, price: 9000 },
      { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 25000 },
      { make: 'Audi', image: 'images/audi-a4-2013.jpg', model: 'A4', year: 2013, price: 26000 },
    ];

    return {
      init() {
        this.buildFilters();
        this.buildCarTemplates(cars);
        this.bind();
      },

      getFilterInput() {
        const selects = Array.from(document.querySelectorAll('select'));

        let filters = selects.map(selection => {
          for (var i = 0; i < selection.options.length; i++) {
            let opt = selection.options[i];
            if (opt.selected === true) {
              return opt.value
            };
          }
        });

        return filters.filter(filter => filter !== 'all');
      },

      renderFilteredModels(filters) {
        const options = Array.from(document.querySelector('select#model'));
        let filteredModels = cars.filter(car => {
          return Object.values(car).includes(filters[0]);
        });

        filteredModels = filteredModels.map(car => Object.values(car));

        options.forEach(option => option.classList.remove('hide'));

        filteredModels.forEach(model => {
          options.forEach(option => {
            if (!filteredModels.some(model =>
              model.includes(option.value))) {
              option.classList.add('hide');
            }
          });
        });
      },

      renderFilteredCars(filters) {
        let filteredCars = cars.filter(car => {
          return filters.every(filter => {
            return Object.values(car).map(String).includes(filter);
          });
        });

        this.buildCarTemplates(filteredCars);
      },

      buildFilters() {
        const makes = new Set(cars.map(obj => obj.make));
        const models = new Set(cars.map(obj => obj.model));
        const years = new Set(cars.map(obj => obj.year));
        const prices = new Set(cars.map(obj => obj.price));
        this.buildSelects(makes, 'make');
        this.buildSelects(models, 'model');
        this.buildSelects(years, 'year');
        this.buildSelects(prices, 'price');
      },

      buildSelects(filters, labelName) {
        const label = document.createElement('label');
        label.setAttribute('for', labelName);
        label.setAttribute('id', labelName);
        label.textContent = `${labelName[0].toUpperCase()}${labelName.slice(1)}`
        const select = document.createElement('select');
        select.setAttribute('name', labelName);
        select.setAttribute('id', labelName);
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = 'All';
        select.appendChild(defaultOption);
        filters.forEach(filter => {
          let option = document.createElement('option');
          option.setAttribute('value', filter);
          option.textContent = filter;
          select.appendChild(option);
        });

        filtersDiv.insertAdjacentElement('beforeEnd', label);
        label.insertAdjacentElement('beforeEnd', select);
      },

      buildCarTemplates(cars) {
        const templ = carPartial.innerHTML;
        Handlebars.registerPartial('car_partial', templ);
        const carsTempl = carsTemplate.innerHTML;
        const carScript = Handlebars.compile(carsTempl);
        const carHtml = carScript({ cars: cars });

        carsDiv.innerHTML = carHtml;
      },

      bind() {
        filterButton.addEventListener('click', e => {
          e.preventDefault();
          let filters = this.getFilterInput();
          this.renderFilteredCars(filters);
        });

        const makeSelect = document.querySelector('select#make');
        const modelSelect = document.querySelector('select#model');

        makeSelect.addEventListener('mouseup', e => {
          e.preventDefault();
          let filters = this.getFilterInput();
          this.renderFilteredModels(filters);
        });
      }

    };
  })();

  carManager.init();
})
