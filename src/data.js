import request from './services/api/request';

export const fetchProjects = async () => {
    try {
        const projects = await request('/api/ogloszenie/getAll', 'GET');
        return projects;
    } catch (error) {
        throw new Error(`Failed to fetch projects: ${error.message}`);
    }
};
