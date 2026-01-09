const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

let sellers;
let customers;
let lastResult;
let lastQuery;

const mapRecords = (data) => data.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount
}));

export function initData(sourceData) {
    // Функция получения справочников
    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }

        return { sellers, customers };
    }

    // Функция получения записей
    const getRecords = async (query = {}, isUpdated = false) => {
        const qs = new URLSearchParams(query).toString();
        if (lastQuery === qs && !isUpdated) {
            return lastResult;
        }

        const response = await fetch(`${BASE_URL}/records?${qs}`);
        const records = await response.json();

        lastQuery = qs;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };
        return lastResult;
    };

    return { getIndexes, getRecords };
}