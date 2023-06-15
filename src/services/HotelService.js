import apiClient from "./services";

// Get all hotels
const getAllHotels = async () => {
   return apiClient.get("hotels");
};

// Get a hotel by ID
const getHotelById = async (id) => {
  return apiClient.get("hotels/"+ id);
}

// Create a new hotel
const createHotel = async (hotel) => {
  return apiClient.post("hotels", hotel);
};

const updateHotel = async (hotel) => {
  return apiClient.put("hotels/" + hotel.id, hotel);
};

const deleteHotel = async (id) => {
  return apiClient.delete("hotels/" + id);
};


export default {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
