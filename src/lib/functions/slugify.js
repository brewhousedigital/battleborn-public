export const slugify = (value) => {
    // Needs to be lowercase
    value = value.toLowerCase();

    // Remove all characters but alphanumeric and spaces
    value = value.replace(/[^a-zA-Z0-9 ]/g, "");

    // Trim
    value = value.trim();

    // Remove extra white spaces
    value = value.replaceAll("  ", " ")
    value = value.replaceAll("  ", " ")
    value = value.replaceAll("  ", " ")

    // Finally, replace all spaces with dashes
    value = value.replaceAll(" ", "-")

    return value;
}