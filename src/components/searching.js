export function initSearching(searchField) {
    return (query, state, action) => {
        const searchValue = (state[searchField] || '').trim();
        return searchValue ? { ...query, search: searchValue } : query;
    };
}