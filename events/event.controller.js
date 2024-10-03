// Import event model
import { Event } from '../models'

// Create event with a given number of tickets
const createEvent = async (req, res) => {
    try {
        const { name, availableTickets } = req.body
        const event = await Event.create({
            name,
            availableTickets
        })
        res.status(201).json({
            message: "Event created successfully",
            success: true,
            event
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }
}

export { createEvent }