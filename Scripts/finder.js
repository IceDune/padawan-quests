//import { Spinner } from "./node_modules/spin.js";

async function dataFetcher(url) {
  fetchedData = [];
  let fetcher = fetch(url);
  let blob = await fetcher;
  let jsonData = await blob.json();
  await fetchedData.push(...jsonData.items);
  await renderItems();
}

function createIssuePost(issueData) {
  let repoName = issueData.repository_url.slice(
    issueData.repository_url.indexOf("repos/") + 6
  );
  let htmlUrl = issueData.html_url;
  let repositoryName = issueData.repository_url.substring(issueData.repository_url.lastIndexOf('repos/') + 6);
  let repositoryUrl = "https://github.com/" + repoName;
  let bodyContent;
  if (issueData.body.indexOf("```") == 0) {
    bodyContent = issueData.body.slice(4, 80);
  } else {
    bodyContent = issueData.body.slice(0, 80);
  }
  let htmlContent = `<div class='post'>
    <h3 class = "issueRepo">
      <a href = "${repositoryUrl}">${repoName}</a>
    </h3>
    <h3 class = "issueHeading">
      <a href = "${htmlUrl}"> ${issueData.title} </a>
    </h3>
    <h3 class = "langData">${selectedLanguage}</h3>
    <p class = "issueBody">${bodyContent}...</p>
  </div>`;
  issuesArea.innerHTML += htmlContent;
}

function renderItems() {
  issuesArea.innerHTML = "";
  if (fetchedData.length == 0) {
    issuesArea.innerHTML =
      "<h3>Sorry, no issues with the given details. try another one.</h3>";
  }
  for (let issue = 0; issue < fetchedData.length; issue++) {
    createIssuePost(fetchedData[issue]);
  }
}

const baseURL = "https://api.github.com";
let globalLanguage = document.getElementById("language");
let filteredLanguage = document.getElementById("filterLanguage");
let label = document.getElementById("issueLabel");
let searchInputText = document.getElementById("searchField");
let issuesArea = document.getElementById("issuesArea");
let searchButton = document.getElementById("search");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("previous");
let selectedLanguage = globalLanguage.value;
let fetchedData = [];
let pageNumber = 1;
let urlValue;

globalLanguage.addEventListener("change", () => {
  pageNumber = 0;
  selectedLanguage = globalLanguage.value;
  urlValue = `${baseURL}/search/issues?q=+language:${selectedLanguage}+label=up for grabs+state=open&order=desc&page=1`;

  dataFetcher(urlValue);
});

searchButton.addEventListener("click", () => {
  pageNumber = 1;
  selectedLanguage = filteredLanguage.value;
  let labelValue = label.value;
  let searchValue = searchInputText.value;
  urlValue = `${baseURL}/search/issues?q=${
    searchValue ? searchValue : " "
  }+language:${
    selectedLanguage ? selectedLanguage : " "
  }+label=${labelValue}+state=open&order=desc&page=1`;

  dataFetcher(urlValue);
});

nextBtn.addEventListener("click", () => {
  if (pageNumber + 1 <= 0) {
    return;
  }
  pageNumber++;
  urlValue = urlValue.slice(0, urlValue.lastIndexOf("=") + 1);
  urlValue += pageNumber;

  dataFetcher(urlValue);
});

prevBtn.addEventListener("click", () => {
  if (pageNumber - 1 <= 0) {
    return;
  }
  pageNumber--;
  urlValue = urlValue.slice(0, urlValue.lastIndexOf("=") + 1);
  urlValue += pageNumber;

  dataFetcher(urlValue);
});

window.addEventListener("scroll", function() {
  if(this.scrollY > 10) {
    document.querySelector('header').classList.add('nav-scrolled');
    document.querySelector('#nav-title').classList.add('heading-scrolled');
    document.querySelector('#nav-language').classList.add('heading-scrolled');
  } else {
    document.querySelector('header').classList.remove('nav-scrolled');
    document.querySelector('#nav-title').classList.remove('heading-scrolled');
    document.querySelector('#nav-language').classList.remove('heading-scrolled');
  }
});
