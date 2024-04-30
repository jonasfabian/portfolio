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

/*
* Checks the clients timezone and return a time of day string accordingly
* */
const parseTimeZone = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date();
    const hours = currentTime.toLocaleTimeString('en-US', {timeZone: userTimeZone, hour: '2-digit', hour12: false});
    if (hours < 11) return 'morning';
    if (hours < 13) return 'day';
    if (hours < 17) return 'afternoon';
    if (hours < 24) return 'evening';
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
    const aboutTextTitle = createDomElement('div', 'About me', 'aboutTextHeader');
    const aboutText = createDomElement('div', `Good ${parseTimeZone()}, I'm Jonas. I'm passionate about creating innovative products from conception to completion. I specialize in designing user-friendly experiences that evolve and enhance over time through data-driven insights. Committed to consistent delivery.`, 'aboutText');
    aboutTextContainer.append(aboutTextTitle, aboutText);

    aboutContainer.append(nameAndAvatarContainer, aboutTextContainer);

    return aboutContainer;
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
            if (index !== 0 && index !== project.technologies.length)
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

const renderWebsites = (websites) => {
    const websiteContainers = createDomElement('div', [], 'websiteContainers');
    const websiteContainersTitle = createDomElement('div', 'Other Projects', 'websiteContainersTitle');

    websiteContainers.append(websiteContainersTitle);

    websites.forEach(website => {
        const websiteContainer = createDomElement('div', [], 'websiteContainer');

        const arrowLink = createDomElement('img', '../assets/arrow-link.svg', 'arrowLink');
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
        const websiteLogo = createDomElement('img', '../assets/logos/' + website.logo, 'websiteLogo');
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
            // projectLogo,
            websiteTechnologies
        );

        websiteContainers.appendChild(websiteContainer);
    });
    return websiteContainers;
}

const initializeContent = (jsonName, htmlName) => {
    loadHtmlFile(htmlName)
        .then(html => {
            main.innerHTML = html;
            return Promise.all([loadJSON(jsonName), loadJSON('websites')]);
        })
        .then(([projects, websites]) => {
            projects = projects.sort((p1, p2) => p1.endDate < p2.endDate ? 1 : -1);
            websites = websites.sort((p1, p2) => p1.startDate < p2.startDate ? 1 : -1);
            main.appendChild(renderAbout());
            main.appendChild(renderProjects(projects));
            main.appendChild(renderWebsites(websites));
        })
        .catch(error => {
            console.error('Failed to load data:', error); // Error handling
        });
}

initializeContent('projects', 'portfolio');
