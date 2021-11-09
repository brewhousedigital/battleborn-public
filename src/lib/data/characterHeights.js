const characterHeights = [
    {"id": 1, "name": "Tiny", "height": 27},
    {"id": 2, "name": "Small", "height": 44},
    {"id": 3, "name": "Medium", "height": 61},
    {"id": 4, "name": "Average", "height": 78},
    {"id": 5, "name": "Tall", "height": 95},
    {"id": 6, "name": "Towering", "height": 112},
];

export const getHeights = (id) => {
    let array;

    if(id === "all") {
        array = characterHeights;
    } else {
        array = characterHeights.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}