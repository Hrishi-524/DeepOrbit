const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; 

export const fetchMetrics = async () => {
    const response = await fetch(`${API_URL}/api/metrics`);
    return response.json();
};

export const fetchPredictions = async (model, dataset) => {
    const response = await fetch(`${API_URL}/api/predictions/${model}/${dataset}`);
    return response.json();
};

export const getPlotUrl = (filename) => {
    return `${API_URL}/api/plots/${filename}`;
};

export const fetchAvailablePlots = async () => {
    const response = await fetch(`${API_URL}/api/available-plots`);
    return response.json();
};