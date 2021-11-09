import items from "$lib/data/items.json";

export const getItems = (id) => {
    let array;

    if(id === "all") {
        array = items
    } else {
        array = items.filter((item) => {
            return item.rowid === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}