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

const renderAbout = () => {
    const aboutContainer = createDomElement('div', [], 'aboutContainer');

    // Avatar, Name and Position Container
    const nameAndAvatarContainer = createDomElement('div', [], 'nameAndAvatarContainer');

    const avatar = createDomElement('img', ['../assets/profile-image.jpg'], 'avatar');

    const nameContainer = createDomElement('div', [], 'nameContainer');
    const name = createDomElement('h1', 'Jonas Fabian', 'name');
    const position = createDomElement('div', 'Product-focused Software Engineer');

    nameContainer.append(name, position);
    nameAndAvatarContainer.append(avatar, nameContainer);

    // About Text Container
    const aboutTextContainer = createDomElement('div', [], 'aboutTextContainer');
    const aboutTextTitle = createDomElement('div', 'About', 'aboutTextHeader');
    const aboutText = createDomElement('div', 'GM, I\'m Jonas. I enjoy building dynamic, creative products from start to finish. Focused on developing intuitive experiences that constantly grow and improve based on user metrics. Always shipping.', 'aboutText');
    aboutTextContainer.append(aboutTextTitle, aboutText);

    aboutContainer.append(nameAndAvatarContainer, aboutTextContainer);

    return aboutContainer;
}

const initializeContent = (jsonName, htmlName) => {
    loadHtmlFile(htmlName)
        .then(html => main.innerHTML = html)
        .then(() => loadJSON(jsonName))
        .then(projects => {
            main.appendChild(renderAbout())
            projects = projects.sort((p1, p2) => p1.endDate < p2.endDate ? 1 : -1);
            main.appendChild(renderProjects(projects))
        });
}

initializeContent('projects', 'portfolio');
