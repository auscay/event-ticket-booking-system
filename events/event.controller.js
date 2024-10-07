// Import event model
import Event from '../modelll/Event.js'
// Create event with a given number of tickets
const createEvent = async (req, res) => {
    try {
      const { name, availableTickets, userId } = req.body;
  
      // Create a new event with the provided data
      const event = await Event.create({ name, availableTickets, userId });
  
      res.status(201).json({
        message: 'Event created successfully',
        success: true,
        event,
      });
    } catch (error) {
      // Detailed error logging
      console.error('Error occurred while creating event:', {
        message: error.message,
        stack: error.stack,
        requestData: req.body, // Include the request data to understand the input
      });
  
      // Return a more informative error message in the response
      res.status(500).json({
        message: `Something went wrong: ${error.message}`, // Include the error message
        success: false,
        error: error.message,  // Pass additional error details in the response
      });
    }
  };

  

export { createEvent }