import './fonts/ys-display/fonts.css'
import './style.css'

// import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

// @todo: подключение
import {initTable} from "./components/table.js";
import {initPagination } from './components/pagination.js';
import {initSorting} from "./components/sorting.js";
import {initSearching} from "./components/searching.js";
import {initFiltering} from "./components/filtering.js";


// Исходные данные используемые в render()
// const { data, ...indexes } = initData(sourceData);

let api;
let applySearching;
let applyFiltering;
let applySorting;
let applyPagination;
let updatePagination;
let updateIndexes;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    return {
        ...state,
        rowsPerPage,
        page
    };
}

async function init() {
    api = await initData();
    const indexes = await api.getIndexes();

    applySearching = initSearching('search');
    ({ applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements));
    applySorting = initSorting([
        sampleTable.header.elements.sortByDate,
        sampleTable.header.elements.sortByTotal
    ]);
    ({ applyPagination, updatePagination } = initPagination(
        sampleTable.pagination.elements,
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const label = el.querySelector('span');
            input.value = page;
            input.checked = isCurrent;
            label.textContent = page;
            return el;
        }
    ));

    updateIndexes({
        searchBySeller: indexes.sellers,
        searchByCustomer: indexes.customers
    });

    render();
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    // let result = [...data]; // копируем для последующего изменения
    // // @todo: использование
    // result = applySearching(result, state, action);
    // result = applyFiltering(result, state, action);
    // result = applySorting(result, state, action);
    // result = applyPagination(result, state, action);

    let query = {};
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords({});
    updatePagination(total, query);

    sampleTable.render(items)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
// const applySearching = initSearching('search');
// const applyFiltering = initFiltering(sampleTable.filter.elements, {
//     searchBySeller: indexes.sellers,
//     searchByCustomer: indexes.customers
// });
// const applySorting = initSorting([
//     sampleTable.header.elements.sortByDate,
//     sampleTable.header.elements.sortByTotal
// ]);
// const applyPagination = initPagination(
//     sampleTable.pagination.elements,
//     (el, page, isCurrent) => {
//         const input = el.querySelector('input');
//         const label = el.querySelector('span');
//         input.value = page;
//         input.checked = isCurrent;
//         label.textContent = page;
//         return el;
//     }
// );

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// render();
init();
