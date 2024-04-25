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
    if (cssClass) {
        domElement.classList.add(cssClass);
    }
    if (tag === 'a') {
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


const renderProjects = (projects) => {
    const projectContainers = createDomElement('div', [], 'projectContainers');
    const projectContainersTitle = createDomElement('div', 'Work experience', 'projectContainersTitle');
    projectContainers.appendChild(projectContainersTitle);

    projects.forEach(project => {
        const projectContainer = createDomElement('div', [], 'projectContainer');

        // Create the project link with the title and arrow icon
        const arrowLink = createDomElement('img', '../assets/arrow-link.svg', 'arrowLink');
        const titleSpan = createDomElement('span', project.name);  // Title span element
        const projectName = createDomElement('a', [project.url, titleSpan], 'projectTitleContainer');  // Project title now an 'a' tag
        projectName.appendChild(arrowLink);  // Append the arrow icon to the 'a' tag

        // Other project details
        const projectStartDate = createDomElement('span', project.startDate);
        const projectEndDate = createDomElement('span', " - " + project.endDate);
        const projectDuration = createDomElement('div', [], 'projectDuration');
        projectDuration.append(projectStartDate);
        projectDuration.append(projectEndDate);

        const projectDescription = createDomElement('span', project.description, 'projectDescription');
        const projectLogo = createDomElement('img', '../assets/logos/' + project.logo, 'projectLogo');
        const projectTechnologies = createDomElement('div', [], 'technologies');

        // Append technologies of project to projectTechnologies element
        project.technologies.forEach((technology, index) => {
            if (index !== 0 && index !== project.technologies.length )
                projectTechnologies.appendChild(createDomElement('span', '•', 'technology'));
            projectTechnologies.append(createDomElement('span', technology.name, 'technology'))
        });

        projectContainer.append(
            projectName,  // This now includes both the title and the link
            projectDuration,
            projectDescription,
            // projectLogo,
            projectTechnologies
        );

        projectContainers.appendChild(projectContainer);
    });
    return projectContainers;
}

const initializeContent = (jsonName, htmlName) => {
    loadHtmlFile(htmlName)
        .then(html => main.innerHTML = html)
        .then(() => loadJSON(jsonName))
        .then(projects => {
            projects = projects.sort((p1, p2) => p1.endDate < p2.endDate ? 1 : -1);
            main.appendChild(renderProjects(projects))
        });
}

initializeContent('projects', 'portfolio');
