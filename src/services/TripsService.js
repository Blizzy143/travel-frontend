import apiClient from "./services";


const createTrip = async (tripData) => {
  return apiClient.post('/trips', tripData);
};

const getTrips = async () => {
  return apiClient.get('/trips');
};

const getTripsByDestinationIdAndUserId = async (userId, destinationId) => {
  return apiClient.get('/trips', {
    params: {
      userId: userId,
      destinationId: destinationId,
    }
  });
};

const getTripById = async (tripId) => {
  return apiClient.get(`/trips/${tripId}`);
};

const updateTrip = async (tripId, tripData) => {
  return apiClient.put(`/trips/${tripId}`, tripData);
};

const deleteTrip = async (tripId) => {
  try {
    await apiClient.delete(`/trips/${tripId}`);
    // No need to return response.data as the trip is deleted successfully
  } catch (error) {
    throw new Error('Failed to delete trip');
  }
};

const addItenary = async (data) => {
  return apiClient.post('/iteneraries', data);
};

// getTripsByDestinationId
const getTripsByDestination = async (destinationId) => {
  return apiClient.get(`/trips/destination/${destinationId}`);
};

// Add user to trip
const addUserToTrip = async (tripId, userId) => {
  return apiClient.post(`/trips/${tripId}/users/${userId}`);
};

// Remove user from trip
const removeUserFromTrip = async (tripId, userId) => {
  return apiClient.delete(`/trips/${tripId}/users/${userId}`);
};


// Get trip by user id
const getTripsByUserId = async (userId) => {
  return apiClient.get(`/trips/user/${userId}`);
};


export default {
  createTrip,
  getTrips,
  getTripsByDestination,
  getTripsByDestinationIdAndUserId,
  getTripById,
  updateTrip,
  deleteTrip,
  addItenary,
  addUserToTrip,
  getTripsByUserId,
  removeUserFromTrip,
};
