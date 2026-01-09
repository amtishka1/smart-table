import './fonts/ys-display/fonts.css'
import './style.css'

// import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

// @todo: подключение
import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initSorting } from "./components/sorting.js";
import { initSearching } from "./components/searching.js";
import { initFiltering } from "./components/filtering.js";

// Исходные данные используемые в render()
// const { data, ...indexes } = initData(sourceData);

let api;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    const total = [parseFloat(state.totalFrom), parseFloat(state.totalTo)];
    return {
        ...state,
        total,
        rowsPerPage,
        page
    };
}

async function init() {
    api = await initData();
    const indexes = await api.getIndexes();
    updateIndexes({ searchBySeller: indexes.sellers });
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы

    let query = {};
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);

    sampleTable.render(items)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const applySearching = initSearching('search');
let { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
let { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

(async () => {
    await init();
    await render();
})()