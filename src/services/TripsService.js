import apiClient from "./services";


const createTrip = async (tripData) => {
  return apiClient.post('/trips', tripData);
};

const getTrips = async () => {
  return apiClient.get('/trips');
};

const getTripsByDestinationId = async (userId, destinationId) => {
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

export default {
  createTrip,
  getTrips,
  getTripsByDestinationId,
  getTripById,
  updateTrip,
  deleteTrip,
};
