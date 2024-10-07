import Booking from "../modelll/Booking.js";
import Event from "../modelll/Event.js";
import WaitingList from "../modelll/WaitingList.js";

// Book a new ticket for an event

const bookTicket = async (req, res) => {
    const { eventId, userId, quantity } = req.body;
  
    try {
      // Fetch the event by ID
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({
          message: 'Event not found',
          success: false,
        });
      }
  
      // Check if enough tickets are available
      if (event.availableTickets >= quantity) {
        // Book the ticket
        const booking = await Booking.create({
          eventId,
          userId,
          quantity,
        });
  
        // Deduct the booked tickets from the event's available tickets
        event.availableTickets -= quantity;
        await event.save();
  
        return res.status(201).json({
          message: 'Ticket booked successfully',
          success: true,
          booking,
        });
      } else {
        // If not enough tickets, add the user to the waiting list
        const waitingListEntry = await WaitingList.create({
          eventId,
          userId,
          quantity,
        });
        return res.status(200).json({
          message: 'Not enough tickets available. You have been added to the waiting list.',
          success: true,
          waitingListEntry,
        });
      }
    } catch (error) {
      console.error('Error occurred while booking ticket:', {
        message: error.message,
        stack: error.stack,
        requestData: req.body, // Include the request data to understand the input
      });
  
      // Return a more informative error message in the response
      res.status(500).json({
        message: `Something went wrong: ${error.message}`, // Include the error message
        success: false,
        error: error.message, // Pass additional error details in the response
      });
    }
  };
  
    


export { bookTicket };