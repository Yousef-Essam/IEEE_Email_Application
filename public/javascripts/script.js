window.onload = () => {
    let container = document.querySelector('.container');
    container.style.top = '5%';
    container.style.opacity = '1';
}

for (let element of document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]')) {
    let placeholder = element.placeholder;
    element.addEventListener('focusout', () => element.placeholder = placeholder);
    element.addEventListener('focus', () => element.placeholder = '');
}