let themes = [
    {"id": 1, "name": "Light"},
    {"id": 2, "name": "Dark"}
]

export const getTheme = (id) => {
    let array;

    if(id === "all") {
        array = themes;
    } else {
        array = themes.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}