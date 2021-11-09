export const slideToggle = (element) => {
    let el = document.querySelector(element);
    // 3rem is a mb-5 class
    if(el.offsetHeight > 0) {
        el.style.height = `0px`;
    } else {
        el.style.height = `calc(${el.scrollHeight}px + 3rem)`;
    }
}