document.addEventListener('DOMContentLoaded', function () {
    console.log('%cHey there! 👋', 'font-size: 14px; font-weight: 600;');
    console.log('%cPortfolio last updated: March 2025', 'font-size: 11px;');
    console.log('%cSystem theme is set by default ✨, but I respect your choice if you change it!', 'color: #707070;');

    const hours = new Date().getHours();
    const greetingElement = document.getElementById('greeting');

    let timeOfDay = 'day';
    if (hours < 11) timeOfDay = 'morning';
    else if (hours < 13) timeOfDay = 'day';
    else if (hours < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    greetingElement.textContent = 'Good ' + timeOfDay;

    const currentYearElement = document.getElementById('currentYear');
    currentYearElement.textContent = new Date().getFullYear();

    const themeButton = document.getElementById('theme-button');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else if (theme === 'ocean') {
            document.body.setAttribute('data-theme', 'ocean');
        } else if (theme === 'light') {
            document.body.removeAttribute('data-theme');
        } else {
            if (prefersDarkScheme.matches) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
        }
    }

    const savedTheme = localStorage.getItem('theme');

    if (!savedTheme || savedTheme === 'system') {
        applyTheme('system');
        if (!savedTheme) localStorage.setItem('theme', 'system');
    } else {
        applyTheme(savedTheme);
    }

    themeButton.addEventListener('click', function () {
        const currentTheme = document.body.getAttribute('data-theme');

        // cycle through themes: light -> dark -> ocean -> light
        if (!currentTheme || currentTheme === 'light') {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else if (currentTheme === 'dark') {
            applyTheme('ocean');
            localStorage.setItem('theme', 'ocean');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });

    prefersDarkScheme.addEventListener('change', function (e) {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
});
