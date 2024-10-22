import React from 'react';
import './css/ProjectSteps.css';

const ProjectSteps = ({ steps }) => {
    return (
        <div>
            {steps.map((step, index) => (
                <div key={index} className="step">
                    <img src={step.image} alt={`Step ${index + 1}`} className="step-image"/>
                    <div className="step-content">
                        <h4>Step {index + 1}</h4>
                        <p>{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectSteps;
