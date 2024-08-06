const main = document.getElementsByTagName("main")[0];
const section = document.getElementById("test");

const loadJSON = async (name) => {
    const res = await fetch(`../data/${name}.json`);
    return res.json();
}

const loadHtmlFile = async (name) => {
    const res = await fetch(`../${name}.html`);
    return res.text();
}

const createDomElement = (tag, content, cssClass) => {
    const domElement = document.createElement(tag);
    if (cssClass) {
        domElement.classList.add(cssClass);
    }
    if (tag === 'a') {
        domElement.target = "_blank";
        domElement.href = content[0];
        (content[1] instanceof HTMLElement) ? domElement.appendChild(content[1]) : domElement.innerHTML = content[1];
        return domElement;
    }
    if (tag === 'img') {
        domElement.src = content;
        return domElement;
    }
    domElement.innerHTML = content;
    return domElement;
}

/*
* Checks the clients timezone and return a time of day string accordingly
* */
const parseTimeZone = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date();
    const hours = currentTime.toLocaleTimeString('en-US', { timeZone: userTimeZone, hour: '2-digit', hour12: false });
    if (hours < 11) return 'morning';
    if (hours < 13) return 'day';
    if (hours < 17) return 'afternoon';
    if (hours < 24) return 'evening';
}

const renderAbout = (aboutData, translations) => {
    const aboutContainer = createDomElement('div', [], 'aboutContainer');

    // Avatar, Name and Position Container
    const nameAndAvatarContainer = createDomElement('div', [], 'nameAndAvatarContainer');

    const avatar = createDomElement('img', ['../assets/profile-image.jpg'], 'avatar');

    const nameContainer = createDomElement('div', [], 'nameContainer');
    const name = createDomElement('h1', aboutData.name, 'name');
    const position = createDomElement('div', aboutData.position);

    nameContainer.append(name, position);
    nameAndAvatarContainer.append(avatar, nameContainer);

    // About Text Container
    const aboutTextContainer = createDomElement('div', [], 'aboutTextContainer');
    const aboutTextTitle = createDomElement('div', translations.aboutMe, 'aboutTextHeader');
    const aboutText = createDomElement('div', `${aboutData.greeting} ${parseTimeZone()}, ${aboutData.aboutText}`, 'aboutText');
    aboutTextContainer.append(aboutTextTitle, aboutText);

    aboutContainer.append(nameAndAvatarContainer, aboutTextContainer);

    return aboutContainer;
}

const renderProjects = (projects, translations) => {
    const projectContainers = createDomElement('div', [], 'projectContainers');
    const projectContainersTitle = createDomElement('div', translations.workExperience, 'projectContainersTitle');
    projectContainers.appendChild(projectContainersTitle);

    projects.forEach(project => {
        const projectContainer = createDomElement('div', [], 'projectContainer');

        // Create the project link with the title and arrow icon
        const arrowLink = createDomElement('img', '../assets/icons/arrow-link.svg', 'arrowLink');
        const titleSpan = createDomElement('span', project.name);  // Title span element
        const projectName = createDomElement('a', [project.url, titleSpan], 'projectTitleContainer');  // Project title now an 'a' tag
        projectName.appendChild(arrowLink);  // Append the arrow icon to the 'a' tag

        // Other project details
        const projectStartDate = createDomElement('span', project.startDate);
        const projectEndDate = createDomElement('span', " - " + (project.endDate || translations.present));
        const projectDuration = createDomElement('div', [], 'projectDuration');
        projectDuration.append(projectStartDate);
        projectDuration.append(projectEndDate);

        const projectDescription = createDomElement('span', project.description, 'projectDescription');
        const projectTechnologies = createDomElement('div', [], 'technologies');

        // Append technologies of project to projectTechnologies element
        project.technologies.forEach((technology, index) => {
            if (index !== 0 && index !== project.technologies.length)
                projectTechnologies.appendChild(createDomElement('span', '•', 'technology'));
            projectTechnologies.append(createDomElement('span', technology.name, 'technology'))
        });

        projectContainer.append(
            projectName,  // This now includes both the title and the link
            projectDuration,
            projectDescription,
            projectTechnologies
        );

        projectContainers.appendChild(projectContainer);
    });
    return projectContainers;
}

const renderWebsites = (websites, translations) => {
    const websiteContainers = createDomElement('div', [], 'websiteContainers');
    const websiteContainersTitle = createDomElement('div', translations.otherProjects, 'websiteContainersTitle');

    websiteContainers.append(websiteContainersTitle);

    websites.forEach(website => {
        const websiteContainer = createDomElement('div', [], 'websiteContainer');

        const arrowLink = createDomElement('img', '../assets/icons/arrow-link.svg', 'arrowLink');
        const titleSpan = createDomElement('span', website.name);
        const websiteName = createDomElement('a', [website.url, titleSpan], 'websiteTitleContainer');
        websiteName.appendChild(arrowLink);

        // Other project details
        const websiteStartDate = createDomElement('span', website.startDate);
        const websiteEndDate = createDomElement('span', website.endDate !== '' ? " - " + website.endDate : '');
        const websiteDuration = createDomElement('div', [], 'websiteDuration');
        websiteDuration.append(websiteStartDate);
        websiteName.append(websiteEndDate);

        const websiteDescription = createDomElement('span', website.description, 'websiteDescription');
        const websiteTechnologies = createDomElement('div', [], 'technologies');

        // Append technologies of project to projectTechnologies element
        website.technologies.forEach((technology, index) => {
            if (index !== 0 && index !== website.technologies.length)
                websiteTechnologies.appendChild(createDomElement('span', '•', 'technology'));
            websiteTechnologies.append(createDomElement('span', technology.name, 'technology'))
        });

        websiteContainer.append(
            websiteName,  // This now includes both the title and the link
            websiteDuration,
            websiteDescription,
            websiteTechnologies
        );

        websiteContainers.appendChild(websiteContainer);
    });
    return websiteContainers;
}

const renderLanguageIcons = () => {
    section.innerHTML = '';

    const gerContainer = createDomElement('img', '../assets/icons/ger.svg');
    gerContainer.style.width = '2rem';
    gerContainer.style.borderRadius = ".2rem";
    gerContainer.onclick = () => initializeContent('de/projects_de', 'portfolio', 'de/websites_de', 'de/about_de');
    section.appendChild(gerContainer)

    const engContainer = createDomElement('img', '../assets/icons/eng.svg');
    engContainer.style.width = '2rem';
    engContainer.style.borderRadius = ".2rem";
    engContainer.onclick = () => initializeContent('en/projects', 'portfolio', 'en/websites', 'en/about');
    section.appendChild(engContainer)
}

let language = "";
let htmlContent = "";
const cachedJson = {};

const initializeContent = async (jsonName, htmlName, websitesName, aboutName) => {
    try {
        if (!htmlContent) {
            htmlContent = await loadHtmlFile(htmlName);
        }
        main.innerHTML = htmlContent;

        if (!cachedJson[jsonName]) {
            cachedJson[jsonName] = await loadJSON(jsonName);
        }
        if (!cachedJson[websitesName]) {
            cachedJson[websitesName] = await loadJSON(websitesName);
        }
        if (!cachedJson[aboutName]) {
            cachedJson[aboutName] = await loadJSON(aboutName);
        }

        const projects = cachedJson[jsonName];
        const websites = cachedJson[websitesName];
        const about = cachedJson[aboutName];
        const translations = about.translations;

        projects.sort((p1, p2) => p1.endDate < p2.endDate ? 1 : -1);
        websites.sort((p1, p2) => p1.startDate < p2.startDate ? 1 : -1);

        renderLanguageIcons();

        main.appendChild(renderAbout(about, translations));
        main.appendChild(renderProjects(projects, translations));
        main.appendChild(renderWebsites(websites, translations));
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}

initializeContent('en/projects', 'portfolio', 'en/websites', 'en/about');
