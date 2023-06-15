import apiClient from "./services";

// Get all places
const getAllPlaces = async () => {
   return apiClient.get("places");
};

// Get a place by ID
const getPlaceById = async (id) => {
  return apiClient.get("places/"+ id);
}

// Create a new place
const createPlace = async (place) => {
  return apiClient.post("places", place);
};

const updatePlace = async (place) => {
  return apiClient.put("places/" + place.id, place);
};

const deletePlace = async (id) => {
  return apiClient.delete("places/" + id);
};


export default {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
};
