const main = document.getElementsByTagName("main")[0];

const loadJSON = (name) => {
    return fetch(`../data/${name}.json`)
        .then(res => res.json());
}

const loadHtmlFile = (name) => {
    return fetch(`../navigation/${name}.html`)
        .then(res => res.text());
}

const createDomElement = (tag, content, cssClass) => {
    const domElement = document.createElement(tag);
    // If tag is hyperlink, then add href property
    if (tag === 'a') {
        domElement['href'] = content[0];
        domElement.append(content[1]);
        return domElement;
    }
    if (tag === 'img') domElement['src'] = content;
    if (cssClass) domElement.classList.add(cssClass);
    domElement.append(content);
    return domElement;
}

const renderProjects = (projects) => {
    const projectContainers = createDomElement('div', [], 'projectContainers');
    projects.forEach(project => {
        const projectContainer = createDomElement('div', [], 'projectContainer');

        const projectName = createDomElement('span', [project.name]);

        // Project duration
        const projectStartDate = createDomElement('span', [project.startDate]);
        const projectEndDate = createDomElement('span', [" - " + project.endDate]);
        const projectDuration = createDomElement('div', []);
        projectDuration.append(projectStartDate);
        projectDuration.append(projectEndDate);

        const projectURL = createDomElement('a', [project.url, project.name]);
        const projectDescription = createDomElement('span', [project.description]);
        const projectLogo = createDomElement('img', ['../assets/logos/' + project.logo], 'projectLogo');
        const projectTechnologies = createDomElement('div', [], 'technologies')

        // Append technologies of project to projectTechnology element
        project.technologies.forEach(technology => projectTechnologies.append(createDomElement('span', [technology.name], 'technology')));

        projectContainer.append(
            projectName,
            projectDuration,
            projectURL,
            projectDescription,
            projectLogo,
            projectTechnologies
        )

        projectContainers.appendChild(projectContainer);
    });
    return projectContainers;
}

const initializeContent = (jsonName, htmlName) => {
    loadHtmlFile(htmlName)
        .then(html => main.innerHTML = html)
        .then(() => loadJSON(jsonName))
        .then(projects => {
            renderHeader()
            main.appendChild(renderProjects(projects))
        });
}

const renderHeader = () => {
    const header = document.getElementsByTagName('header')[0];
    const nameContainer = createDomElement('div', []);
    nameContainer.appendChild(createDomElement('span', ['Jonas Fabian']))
    header.appendChild(nameContainer);

    const navigationContainer = createDomElement('nav', [], 'navigation');
    navigationContainer.appendChild(createDomElement('a', ['./index.html', 'Home']));
    navigationContainer.appendChild(createDomElement('a', ['../navigation/about.html', 'About']));
    navigationContainer.appendChild(createDomElement('a', ['../navigation/contact.html', 'Contact']));
    navigationContainer.appendChild(createDomElement('a', ['../navigation/portfolio.html', 'Portfolio']));
    navigationContainer.appendChild(createDomElement('a', ['../navigation/skills.html', 'Skills']));
    header.appendChild(navigationContainer)
}

initializeContent('projects', 'portfolio');
