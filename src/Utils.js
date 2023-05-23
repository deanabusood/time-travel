import axios from "axios";

export const populateMonths = () => {
  const monthInput = document.querySelector("#months");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    monthInput.appendChild(option);
  });
};

export const populateDays = () => {
  const monthInput = document.querySelector("#months");
  const dayInput = document.querySelector("#days");

  while (dayInput.firstChild) {
    dayInput.removeChild(dayInput.firstChild);
  }

  let numDays;
  const month = monthInput.value;

  switch (month) {
    case "1":
    case "3":
    case "5":
    case "7":
    case "8":
    case "10":
    case "12":
      numDays = 31;
      break;
    case "4":
    case "6":
    case "9":
    case "11":
      numDays = 30;
      break;
    case "2":
      numDays = 29;
      break;
    default:
      numDays = 0;
  }

  for (let i = 1; i <= numDays; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    dayInput.appendChild(option);
  }
};

export const handleSubmit = async () => {
  const dayInput = document.querySelector("#days");
  const monthInput = document.querySelector("#months");

  if (isInputEmpty()) return;

  const userInputMonth = getUserMonth(monthInput.value);
  const userInputDay = getUserDay(dayInput.value);
  const APIendpoint = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${userInputMonth}/${userInputDay}`;

  disableSearch();
  clearOutput();

  try {
    const response = await axios.get(APIendpoint);
    const data = response.data;

    if (data.error) {
      throw new Error("error");
    }

    gatherData(data);
  } catch (error) {
    showError(error);
  } finally {
    enableSearch();
  }
};

const isInputEmpty = () => {
  const dayInput = document.querySelector("#days");
  const monthInput = document.querySelector("#months");
  return !dayInput.value || !monthInput.value;
};

const disableSearch = () => {
  const monthInput = document.querySelector("#months");
  const dayInput = document.querySelector("#days");
  const submitButton = document.querySelector("#submit-button");

  monthInput.disabled = true;
  dayInput.disabled = true;
  submitButton.disabled = true;
};

const enableSearch = () => {
  const monthInput = document.querySelector("#months");
  const dayInput = document.querySelector("#days");
  const submitButton = document.querySelector("#submit-button");

  monthInput.disabled = false;
  dayInput.disabled = false;
  submitButton.disabled = false;
};

const getUserMonth = (month) => {
  return month < 10 ? "0" + month : month;
};

const getUserDay = (day) => {
  return day < 10 ? "0" + day : day;
};

const gatherData = (data) => {
  const results = [];
  const duplicateCheck = [];
  const eventCount = 4;

  while (results.length < eventCount) {
    const index = Math.floor(Math.random() * data.events.length);

    if (!duplicateCheck.includes(index)) {
      duplicateCheck.push(index);

      const event = {
        title: data.events[index].pages[0].normalizedtitle,
        year: data.events[index].year,
        text: data.events[index].text,
        url: data.events[index].pages[0].content_urls.desktop.page,
        image:
          "thumbnail" in data.events[index].pages[0]
            ? data.events[index].pages[0].thumbnail.source
            : "./images/no-image-found.png",
      };

      results.push(event);
    }
  }

  showResults(results);
};

const showResults = (results) => {
  const outputContainer = document.querySelector("#output");

  for (let i = 0; i < results.length; i++) {
    const container = document.createElement("div");
    container.classList.add("event-container");

    const imageDiv = document.createElement("div");
    imageDiv.classList.add("event-image-container");

    const link = document.createElement("a");
    link.href = results[i].url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const image = document.createElement("img");
    image.src = results[i].image;
    image.classList.add("event-image");

    link.appendChild(image);
    imageDiv.appendChild(link);
    container.appendChild(imageDiv);

    const title = document.createElement("h3");
    title.classList.add("event-title");
    title.innerText = results[i].title;

    if (!title.innerText.includes(results[i].year)) {
      title.innerText += " (" + results[i].year + ")";
    }

    container.appendChild(title);

    const text = document.createElement("p");
    text.classList.add("event-text");
    text.innerText = results[i].text;
    container.appendChild(text);

    outputContainer.appendChild(container);
  }
};

const clearOutput = () => {
  const outputContainer = document.querySelector("#output");
  if (outputContainer) {
    outputContainer.textContent = "";
    const error = outputContainer.querySelector("#error");
    if (error) {
      error.textContent = "";
    }
  }
};

const showError = (error) => {
  const outputContainer = document.querySelector("#output");
  if (outputContainer) {
    const errorElement = outputContainer.querySelector("#error");
    if (errorElement) {
      errorElement.textContent = "An error occurred, please try again.";
    }
  }
};
