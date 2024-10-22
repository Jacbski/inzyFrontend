import React, { useState } from 'react';
import ProjectFeed from './components/ProjectFeed/ProjectFeed';
import ProjectView from './components/ProjectView/ProjectView';

const App = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleCloseView = () => {
        setSelectedProject(null);
    };

    return (
        <div>
            {!selectedProject ? (
                <ProjectFeed onProjectClick={handleProjectClick} />
            ) : (
                <ProjectView project={selectedProject} onClose={handleCloseView} />
            )}
        </div>
    );
};

export default App;
