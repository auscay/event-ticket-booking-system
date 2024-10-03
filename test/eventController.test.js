
import { createEvent } from '../events/event.controller.js';
import { Event } from '../models';
jest.mock('../models', () => ({
  Event: {
    create: jest.fn(),
  },
}));

describe('createEvent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'Test Event',
        availableTickets: 100,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an event successfully', async () => {
    const mockEvent = {
      id: 1,
      name: 'Test Event',
      availableTickets: 100,
    };
    Event.create.mockResolvedValue(mockEvent);

    await createEvent(req, res);

    expect(Event.create).toHaveBeenCalledWith({
      name: 'Test Event',
      availableTickets: 100,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Event created successfully',
      success: true,
      event: mockEvent,
    });
  });

  it('should handle errors', async () => {
    Event.create.mockRejectedValue(new Error('Database error'));

    await createEvent(req, res);

    expect(Event.create).toHaveBeenCalledWith({
      name: 'Test Event',
      availableTickets: 100,
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
      success: false,
    });
  });
});


