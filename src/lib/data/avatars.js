let avatars = [
    {"id": 1, "name": "Crusader", "image": "profile-icon-1-crusader.png"},
    {"id": 2, "name": "Dark Crusader", "image": "profile-icon-2-crusader-dark.png"},
    {"id": 3, "name": "Benefactor", "image": "profile-icon-3-benefactor.png"},
    {"id": 4, "name": "Dark Benefactor", "image": "profile-icon-4-benefactor-dark.png"},
    {"id": 5, "name": "Malefactor", "image": "profile-icon-5-malefactor.png"},
    {"id": 6, "name": "Dark Malefactor", "image": "profile-icon-6-malefactor-dark.png"},
    {"id": 7, "name": "Rebel", "image": "profile-icon-7-rebel.png"},
    {"id": 8, "name": "Dark Rebel", "image": "profile-icon-8-rebel-dark.png"},
    {"id": 9, "name": "Grey", "image": "profile-icon-9-grey.png"}
]

export const getAvatar = (id) => {
    let array;

    if(id === "all") {
        array = avatars;
    } else {
        array = avatars.filter((item) => {
            return item.id === id
        })
    }

    if(array.length > 1) {
        return array;
    } else {
        return array[0];
    }
}