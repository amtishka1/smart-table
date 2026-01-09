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
            const container = action.parentElement;
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