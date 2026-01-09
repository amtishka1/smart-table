import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

// export function initFiltering(elements, indexes) {
//     // @todo: #4.1 — заполнить выпадающие списки опциями
//     Object.keys(indexes).forEach(elementName => {
//         elements[elementName].append(
//             ...Object.values(indexes[elementName]).map(name => {
//                 const option = document.createElement('option');
//                 option.value = name;
//                 option.textContent = name;
//                 return option;
//             })
//         );
//     });

//     return (data, state, action) => {
//         // @todo: #4.2 — обработать очистку поля
//         if (action?.name === 'clear') {
//             const input = action.closest('[data-field]')?.querySelector('input');
//             const field = action.dataset.field;
//             if (input && field) {
//                 input.value = '';
//                 state[field] = '';
//             }
//         }

//         // @todo: #4.5 — отфильтровать данные используя компаратор
//         return data.filter(row => compare(row, state));
//     }
// }

export function initFiltering(elements) {
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach(name => {
            const select = elements[name];
            if (select) {
                select.append(
                    ...Object.values(indexes[name]).map(value => {
                        const opt = document.createElement('option');
                        opt.value = value;
                        opt.textContent = value;
                        return opt;
                    })
                );
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        // Очистка поля
        if (action?.name === 'clear') {
            const container = action.closest('[data-field]');
            const input = container?.querySelector('input');
            const field = action.dataset.field;
            if (input && field) {
                input.value = '';
                // state[field] = ''; ← не нужно менять state, он перечитывается
            }
        }

        // Формируем filter[...]
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (el && ['INPUT', 'SELECT'].includes(el.tagName) && el.value) {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length ? { ...query, ...filter } : query;
    };

    return { updateIndexes, applyFiltering };
}