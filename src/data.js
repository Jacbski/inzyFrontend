export const fetchProjects = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/ogloszenie/getAll');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        return projects;
    } catch (error) {
        throw new Error("Failed to fetch projects");
    }
};