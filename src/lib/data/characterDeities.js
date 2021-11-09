const characterDeities = [
    {"id": 1, "name": "Honor"},
    {"id": 2, "name": "Travel"},
    {"id": 3, "name": "Strength"},
    {"id": 4, "name": "Nature"},
    {"id": 5, "name": "Revels"},
    {"id": 6, "name": "Knowledge"},
    {"id": 7, "name": "Death"},
    {"id": 8, "name": "Magic"},
    {"id": 9, "name": "None"},
];

export const getDeities = (id) => {
    let array;

    if(id === "all") {
        array = characterDeities;
    } else {
        array = characterDeities.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}