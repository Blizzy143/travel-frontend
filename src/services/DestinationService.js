import apiClient from "./services";

// Get all destinations
const getAllDestinations = async () => {
   return apiClient.get("destinations");
};

// Get a destination by ID
const getDestinationById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getting destination with ID ${id}:`, error);
    throw error;
  }
};

// Create a new destination
const createDestination = async (destination) => {
  return apiClient.post("destinations", destination);
};

// Update a destination by ID
const updateDestination = async (id, destination) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, destination);
    return response.data;
  } catch (error) {
    console.error(`Error in updating destination with ID ${id}:`, error);
    throw error;
  }
};

// Delete a destination by ID
const deleteDestination = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in deleting destination with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
