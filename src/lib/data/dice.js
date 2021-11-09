let diceList = [
    {"id": 1, "name": "1d4", "base": "4", "min": "1", "max": "4"},
    {"id": 2, "name": "1d6", "base": "6", "min": "1", "max": "6"},
    {"id": 3, "name": "1d8", "base": "8", "min": "1", "max": "8"},
    {"id": 4, "name": "1d10", "base": "10", "min": "1", "max": "10"},
    {"id": 5, "name": "1d12", "base": "12", "min": "1", "max": "12"},
    {"id": 6, "name": "1d20", "base": "20", "min": "1", "max": "20"},
    {"id": 7, "name": "1d100", "base": "100", "min": "1", "max": "100"},

    {"id": 51, "name": "2d4", "base": "4", "min": "1", "max": "8"},
    {"id": 52, "name": "2d6", "base": "6", "min": "1", "max": "12"},
    {"id": 53, "name": "2d8", "base": "8", "min": "1", "max": "16"},
    {"id": 54, "name": "2d10", "base": "10", "min": "1", "max": "20"},
    {"id": 55, "name": "2d12", "base": "12", "min": "1", "max": "24"},
    {"id": 56, "name": "2d20", "base": "20", "min": "1", "max": "40"},
    {"id": 57, "name": "2d100", "base": "100", "min": "1", "max": "200"},

    {"id": 101, "name": "3d4", "base": "4", "min": "3", "max": "12"},
    {"id": 102, "name": "3d6", "base": "6", "min": "3", "max": "18"},
    {"id": 103, "name": "3d8", "base": "8", "min": "3", "max": "24"},
    {"id": 104, "name": "3d10", "base": "10", "min": "3", "max": "30"},
    {"id": 105, "name": "3d12", "base": "12", "min": "3", "max": "36"},
    {"id": 106, "name": "3d20", "base": "20", "min": "3", "max": "60"},
    {"id": 107, "name": "3d100", "base": "100", "min": "3", "max": "300"},
]

export const getDice = (id = "all") => {
    let array;
    let requestedId = parseInt(id);

    if(id === "all") {
        // Send all data back
        array = diceList;

    } else if(id === "low") {
        array = diceList.filter((item) => {
            return item.id < 20
        })

    } else if(id === "middle") {
        array = diceList.filter((item) => {
            return item.id > 20 && item.id < 70
        })

    } else if(id === "high") {
        array = diceList.filter((item) => {
            return item.id > 70
        })

    } else {
        array = diceList.filter((item) => {
            return item.id === requestedId
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}

