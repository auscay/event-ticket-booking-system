import { sequelize } from "../db/index.js";
import Booking from "../modelll/Booking.js";
import Event from "../modelll/Event.js";
import WaitingList from "../modelll/WaitingList.js";

// Book a new ticket for an event

const bookTicket = async (req, res) => {
  const { eventId, userId, quantity } = req.body;

  let transaction;
  try {
    // Start a new transaction
    transaction = await sequelize.transaction();

    // Fetch the event by ID within the transaction
    const event = await Event.findByPk(eventId, { lock: true, transaction });
    if (!event) {
      console.error(`Event not found: ID ${eventId}`);
      await transaction.rollback();
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    // Log the event details for debugging
    console.log(
      `Fetched event: ${event.name}, Available Tickets: ${event.availableTickets}`
    );

    // Check if enough tickets are available
    if (event.availableTickets >= quantity) {
      console.log(`Booking ${quantity} tickets for user ${userId}...`);

      // Book the ticket within the transaction
      const booking = await Booking.create(
        {
          eventId,
          userId,
          quantity,
        },
        { transaction }
      );

      // Deduct the booked tickets from the event's available tickets
      event.availableTickets -= quantity;
      await event.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      console.log(`Booking successful. Tickets booked: ${quantity}`);

      return res.status(201).json({
        message: "Ticket booked successfully",
        success: true,
        booking,
      });
    } else {
      console.log(
        `Not enough tickets. Adding user ${userId} to waiting list...`
      );

      // If not enough tickets, add the user to the waiting list within the transaction
      const waitingListEntry = await WaitingList.create(
        {
          eventId,
          userId,
          quantity,
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      console.log(
        `User ${userId} added to the waiting list for Event ID ${eventId}.`
      );

      return res.status(200).json({
        message:
          "Not enough tickets available. You have been added to the waiting list.",
        success: true,
        waitingListEntry,
      });
    }
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Error occurred while booking ticket:", {
      message: error.message,
      stack: error.stack,
      requestData: req.body, // Include the request data to understand the input
    });

    // Return a more informative error message in the response
    return res.status(500).json({
      message: `Something went wrong: ${error.message}`, // Include the error message
      success: false,
      error: error.message, // Pass additional error details in the response
    });
  }
};

// Cancel a booked ticket and automatically assign the ticket to the next user in the waiting list

const cancelBooking = async (req, res) => {
  const { userId, eventId } = req.body;
  console.log("Cancel request received:", { userId, eventId });

  let transaction;
  try {
    // Start a transaction for concurrency control and data integrity
    transaction = await sequelize.transaction();
    console.log("Transaction started for cancelBooking operation.");

    // Step 1: Find the booking
    console.log(`Searching for booking with userId: ${userId}, eventId: ${eventId}`);
    const booking = await Booking.findOne({ where: { userId, eventId }, transaction });

    // Step 2: Handle missing booking
    if (!booking) {
      console.warn("Booking not found for the provided userId and eventId.");
      return res.status(404).json({ error: "Booking not found" });
    }
    console.log("Booking found:", booking.toJSON());

    // Step 3: Delete the booking
    await booking.destroy({ transaction });
    console.log(`Booking for userId: ${userId}, eventId: ${eventId} deleted successfully.`);

    // Step 4: Check the waiting list for the next user
    const nextUser = await WaitingList.findOne({ where: { eventId }, transaction });
    const event = await Event.findByPk(eventId, { transaction });

    if (nextUser) {
      console.log("Next user found in the waiting list:", nextUser.toJSON());

      // Step 5: Transfer booking to the next user and remove them from the waiting list
      await Booking.create(
        {
          userId: nextUser.userId,
          eventId,
          quantity: nextUser.quantity,
          status: "booked",
        },
        { transaction }
      );
      console.log(`New booking created for userId: ${nextUser.userId} from the waiting list.`);
      await nextUser.destroy({ transaction });
      console.log(`User with userId: ${nextUser.userId} removed from the waiting list.`);

      // Step 6: Calculate the remaining available tickets and update the event
      const remainingTickets = booking.quantity - nextUser.quantity; // Correct difference
      event.availableTickets += remainingTickets;
      console.log(`Available tickets incremented by ${remainingTickets} for event:`, event.toJSON());

    } else {
      // No users in the waiting list, so return all canceled tickets
      console.log("No users in the waiting list. Incrementing available tickets.");
      event.availableTickets += booking.quantity; // Return all canceled tickets
      console.log(`Available tickets incremented by ${booking.quantity} for event:`, event.toJSON());
    }

    // Step 7: Save the event and commit the transaction
    await event.save({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Booking cancelled successfully" });
    console.log(`Cancellation process completed successfully for userId: ${userId}, eventId: ${eventId}.`);

  } catch (error) {
    // Rollback the transaction if any error occurs
    if (transaction) await transaction.rollback();
    console.error("Transaction rolled back due to an error.");

    // Step 8: Error handling with detailed logs
    console.error("Error occurred while cancelling the booking:", {
      message: error.message,
      stack: error.stack,
      requestData: req.body, // Include the request data to understand the input
    });

    res.status(500).json({
      error: `An error occurred while cancelling the booking: ${error.message}`,
    });
  }
};

  

export { bookTicket, cancelBooking };
