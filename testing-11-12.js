export const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error.messege);
  }
};
export const getFromStorage = (key) => {
  try {
    const serialisedState = localStorage.getItem(key);
    return serialisedState === null ? undefined : JSON.parse(serialisedState);
  } catch (error) {
    console.log(error.messege);
  }
};

export const localStorageKeys = {
  WATCHED: "watched",
  QUEUE: "queue",
};

//   -----------------------------------------------------

import { renderGallery } from "./create-gallery-markup";
import { getFromStorage, localStorageKeys } from "./local-storage";
import {
  clearPagination,
  renderPaginationMarkup,
  resetCurrentPage,
} from "./pagination";
import { moviesEl } from "./rendering-movie-cards";
import { state } from "./state";

export const updateLibRender = async (data) => {
  try {
    let markup = "";
    const warning = `<li class="watched-img"><p class="watched-warning">No movies have been added yet. Let's go pick something to your liking</p></li>`;
    resetCurrentPage();
    const films = localPaginate(data, state.currentPage);
    if (data === undefined || data.length === 0) {
      clearPagination();
      markup = warning;
    } else {
      markup = await renderGallery(films);
      clearPagination();
      renderPaginationMarkup();
    }
    moviesEl.innerHTML = "";
    moviesEl.insertAdjacentHTML("beforeend", markup);
  } catch (error) {
    console.error(error.message);
  }
};
export const localPaginate = (array, currentPage) => {
  if (!array) return;
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  state.totalPages = Math.ceil(array.length / itemsPerPage);
  return array.slice(startIndex, startIndex + itemsPerPage);
};

export const loadFromStorageWatched = () => {
  const data = getFromStorage(localStorageKeys.WATCHED);
  state.whatPaginated = "local";
  state.whatchedOrQueue = "WATCHED";
  updateLibRender(data);
};
export const onClickWatched = async (evt) => {
  if (evt.target.nodeName !== "BUTTON") return;
  if (evt.target.classList.contains("active")) return;
  const activeBtn = document.querySelector(".active");
  let key = evt.target.dataset.value.toUpperCase();
  state.whatchedOrQueue = key;
  const data = getFromStorage(localStorageKeys[key]);
  updateLibRender(data);
  activeBtn.classList.remove("active");
  evt.target.classList.add("active");
};

// -------------------------------------------------------------

import { page } from "./js/api";
import "./js/api";
import "./js/sound";
import "./js/custom-components";
import "./js/trailer";
import "./js/loader";

import * as renderingFromStorage from "./js/render-from-storage";
import "./js/team-load-to-modal";
import "./js/open-and-close-modal";
import { refs } from "./js/refs";

import {
  onBtnAddToLibrary,
  updateMarkupLibrary,
} from "./js/add-to-watched&queue";
import { onBtnPageClick } from "./js/pagination";

window.addEventListener("load", renderingFromStorage.loadFromStorageWatched);
refs.watchedQueueBtnBlock.addEventListener(
  "click",
  renderingFromStorage.onClickWatched
);
refs.btnWrapper.addEventListener("click", onBtnAddToLibrary);
refs.btnWrapper.addEventListener("click", updateMarkupLibrary);
refs.pagination.addEventListener("click", onBtnPageClick);
