function serializeVehicle(vehicle) {
  return { ...vehicle, dailyRate: Number(vehicle.dailyRate) };
}

function serializeRental(rental) {
  const result = { ...rental, totalPrice: Number(rental.totalPrice) };
  if (rental.vehicle) {
    result.vehicle = serializeVehicle(rental.vehicle);
  }
  return result;
}

module.exports = { serializeVehicle, serializeRental };
