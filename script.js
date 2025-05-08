document.addEventListener('DOMContentLoaded', function () {
    console.log('%cHey there! 👋', 'font-size: 14px; font-weight: 600;');
    const lastUpdatedDate = new Date(); 
    console.log(`%cPortfolio last updated: ${lastUpdatedDate.toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' })}`, 'font-size: 11px;'); 
    console.log('%cSystem theme is the default. You can cycle through Light, Dark, and back to System. ✨', 'color: #707070;');

    const hours = new Date().getHours();
    const greetingElement = document.getElementById('greeting');

    let timeOfDay = 'day';
    if (hours < 11) timeOfDay = 'morning';
    else if (hours < 13) timeOfDay = 'day'; 
    else if (hours < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';

    if (greetingElement) {
        greetingElement.textContent = 'Good ' + timeOfDay;
    }

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const themeButton = document.getElementById('theme-button');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    function applyTheme(themePreference) {
        document.body.classList.remove('display-system-icon', 'display-light-icon', 'display-dark-icon');

        if (themePreference === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            document.body.classList.add('display-dark-icon');
        } else if (themePreference === 'light') {
            document.body.removeAttribute('data-theme');
            document.body.classList.add('display-light-icon');
        } else if (themePreference === 'system') {
            if (prefersDarkScheme.matches) {
                document.body.setAttribute('data-theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
            }
            document.body.classList.add('display-system-icon');
        }
    }

    let currentThemePreference = localStorage.getItem('theme');
    if (!currentThemePreference || !['system', 'light', 'dark'].includes(currentThemePreference)) {
        currentThemePreference = 'system'; 
        localStorage.setItem('theme', 'system');
    }
    applyTheme(currentThemePreference); 

    if (themeButton) {
        themeButton.addEventListener('click', function () {
            let newThemePreference;
            const storedPreference = localStorage.getItem('theme') || 'system';

            if (storedPreference === 'system') {
                newThemePreference = 'light';
            } else if (storedPreference === 'light') {
                newThemePreference = 'dark';
            } else { 
                newThemePreference = 'system';
            }
            localStorage.setItem('theme', newThemePreference);
            applyTheme(newThemePreference);
        });
    }

    if (prefersDarkScheme) {
        prefersDarkScheme.addEventListener('change', function (e) {
            const storedPreference = localStorage.getItem('theme');
            if (storedPreference === 'system') {
                applyTheme('system'); 
            }
        });
    }
});
