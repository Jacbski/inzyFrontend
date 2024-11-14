import React from 'react';
import './css/ProjectSteps.css';

const ProjectSteps = ({ steps }) => {
    if (!steps || steps.length === 0) {
        return <div className="no-steps">No steps attached</div>;
    }

    return (
        <div className="project-steps">
            {steps.map((step, index) => (
                <div key={index} className="step">
                    {step.stepImage ? (
                        <img
                            src={step.stepImage}
                            alt={`Step ${index + 1}`}
                            className="step-image"
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150"
                            alt={`Placeholder for Step ${index + 1}`}
                            className="step-image"
                        />
                    )}
                    <div className="step-content">
                        <h4>{step.stepTitle || `Step ${index + 1}`}</h4>
                        <p>{step.stepDescription || 'No description available'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectSteps;