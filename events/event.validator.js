import joi from "joi"

const eventCreationValidator = async (req, res, next) => {
    try {
        const bodyOfRequest = req.body
        const schema = joi.object({
            name: joi.string().required(),
            availableTickets: joi.number().required()
        })
        await schema.validateAsync(bodyOfRequest, { abortEarly: true })
        next()
    } catch (error) {
        res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

export { eventCreationValidator }