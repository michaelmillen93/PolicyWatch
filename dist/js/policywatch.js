"use strict";

//ELEMENT SELECTORS/API KEY
const filterContainer = document.querySelector(".filter");
const filterTabs = document.querySelectorAll(".filter__tab");
const searchInput = document.getElementById("search-input");
const countrySelect = document.getElementById("country__select");
const flagContainer = document.getElementById("flag-container");
const btnSearch = document.querySelector(".btn__search");
const resultsContainer = document.querySelector(".results-container");

//GET DATA FROM API///
const key = config.API_KEY;

const getJSON = async function (country, category) {
  try {
    resultsContainer.innerHTML = "";

    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${key}`
    );

    const data = await res.json();

    //Render a list item for each article in the dataset
    data.articles.forEach((article) => {
      renderToDom(article);
    });
  } catch (err) {
    console.error(`${err.message}`);
  }
};

///////

//FLAG DATA///

//Gets flag data from restcountries api
const getFlagData = async function (country) {
  try {
    const res = await fetch(`https://restcountries.eu/rest/v2/name/${country}`);
    const data = await res.json();

    renderFlag(data);
  } catch (err) {
    console.error(err);
  }
};

//Function to render flag to the DOM
const renderFlag = async function (data) {
  //If search for Korea, web api should return South Korean flag

  const html = `<article class="flag">
  <img class="flag__img" src=${
    data[0].name === `Korea (Democratic People's Republic of)`
      ? data[1].flag
      : data[0].flag
  }
  </article>`;

  flagContainer.innerHTML = "";

  flagContainer.insertAdjacentHTML("beforeend", html);
};

///////////

//FUNCTION TO RENDER LIST OF ARTICLES TO DOM
const renderToDom = function (data) {
  const html = `
  <div class="result">

  <img class="result__image" src="${data.urlToImage}" alt="photo not found" />

 <div class="result__content">
 <a href="${data.url}" target="_blank"><h3>${data.title}</h3></a>
 <h3>${data.publishedAt}</h3>
 <h3>${data.source.name}</h3>
 </div>
 </div>
 `;

  resultsContainer.insertAdjacentHTML("beforeend", html);
};

const getCategoryJSON = function (e) {
  e.preventDefault();

  const country =
    countrySelect.options[countrySelect.selectedIndex].value.toLowerCase();
  const category = e.target.innerText;

  getJSON(country, category);
};

//EVENT LISTENERS

filterContainer.addEventListener("click", function (e) {
  e.preventDefault();

  const clicked = e.target.closest(".filter__tab");

  if (!clicked) return; //Guard clause prevents any unwanted return
  const category = clicked.innerText;

  filterTabs.forEach((tab) => tab.classList.remove("filter__tab--active"));

  clicked.classList.add("filter__tab--active");
});

filterTabs.forEach((tab) => {
  tab.addEventListener("click", getCategoryJSON);
});

countrySelect.addEventListener("change", (e) => {
  e.preventDefault();

  const country = countrySelect.options[countrySelect.selectedIndex].innerHTML;
  getFlagData(country);
});
