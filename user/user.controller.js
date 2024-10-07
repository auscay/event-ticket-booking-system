import User from '../modelll/User.js'

const createUser = async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;

      // Create a new user with the provided data
      const user = await User.create({ firstName, lastName, email });

      res.status(201).json({
        message: 'User created successfully',
        success: true,
        user,
      });
    } catch (error) {
      // Detailed error logging
      console.error('Error occurred while creating user:', {
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

export { createUser }