// Import event model
import Event from "../modelll/Event.js";
import WaitingList from "../modelll/WaitingList.js";

// Create event with a given number of tickets
const createEvent = async (req, res) => {
  try {
    const { name, availableTickets, userId } = req.body;

    // Create a new event with the provided data
    const event = await Event.create({ name, availableTickets, userId });

    res.status(201).json({
      message: "Event created successfully",
      success: true,
      event,
    });
  } catch (error) {
    // Detailed error logging
    console.error("Error occurred while creating event:", {
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

// Retrieve the current status of an event (available tickets, waiting list count)
const getEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params; // Assuming the event ID is passed as a URL parameter, e.g., /event/:eventId

    // Check if the eventId is provided
    if (!eventId) {
      console.error("Error: eventId is not provided in the request.");
      return res
        .status(400)
        .json({ message: "Event ID is required.", success: false });
    }

    // Fetch the event details using the eventId
    const event = await Event.findByPk(eventId);

    if (!event) {
      console.error(`Error: Event with ID ${eventId} not found.`);
      return res
        .status(404)
        .json({
          message: `Event with ID ${eventId} not found.`,
          success: false,
        });
    }

    console.log(
      `Event found: ${event.name}, Available Tickets: ${event.availableTickets}`
    );

    // Fetch the count of users on the waiting list for this event
    const waitingListCount = await WaitingList.count({ where: { eventId } });

    console.log(
      `Number of users on the waiting list for Event ID ${eventId}: ${waitingListCount}`
    );

    // Return the event status
    res.status(200).json({
      message: "Event status retrieved successfully",
      success: true,
      event: {
        name: event.name,
        availableTickets: event.availableTickets,
        waitingListCount: waitingListCount,
      },
    });
  } catch (error) {
    // Detailed error logging
    console.error("Error occurred while retrieving event status:", {
      message: error.message,
      stack: error.stack,
      requestData: req.params, // Include the request data to understand the input
    });

    // Return an informative error message in the response
    res.status(500).json({
      message: `Something went wrong: ${error.message}`, // Include the error message
      success: false,
      error: error.message, // Pass additional error details in the response
    });
  }
};

export { createEvent, getEventStatus };
