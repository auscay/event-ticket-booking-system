import Booking from "../modelll/Booking.js";
import Event from "../modelll/Event.js";

// Book a new ticket for an event

const bookTicket = async (req, res) => {
    const { eventId, userId, quantity } = req.body;
    try {
        
         // Check if the quantity is a valid positive integer
        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({
            message: "Quantity must be a positive integer",
            success: false,
            });
        }
    } catch (error) {
        
    }
    
}

export { bookTicket };