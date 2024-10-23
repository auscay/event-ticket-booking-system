import { createEvent } from '../events/event.controller'; // Import the controller
import Event from '../modelll/Event'; // Import the Event model
import httpMocks from 'node-mocks-http'; // Mock request and response
import sinon from 'sinon'; // Stub and Spy functionalities for testing

describe('createEvent Controller', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock request and response
    req = httpMocks.createRequest({
      body: {
        name: 'Test Event',
        availableTickets: 100,
        userId: 1,
      },
    });
    res = httpMocks.createResponse();

    // Stub the Event model's create method
    sandbox.stub(Event, 'create');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create an event successfully', async () => {
    // Mock the Event.create() function to resolve and return a new event object
    Event.create.resolves({
      id: 1,
      name: 'Test Event',
      availableTickets: 100,
      userId: 1,
    });

    // Call the controller function
    await createEvent(req, res);

    // Assert that the response status is 201 and the correct message is returned
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().message).toBe('Event created successfully');
    expect(res._getJSONData().success).toBe(true);

    // Ensure that the Event.create method was called once
    expect(Event.create.calledOnce).toBe(true);

    // Ensure that the event data passed is correct
    expect(Event.create.calledWith({
      name: 'Test Event',
      availableTickets: 100,
      userId: 1,
    })).toBe(true);
  });

  it('should handle errors and return a 500 status', async () => {
    // Mock the Event.create() function to throw an error
    Event.create.rejects(new Error('Database Error'));

    // Call the controller function
    await createEvent(req, res);

    // Assert that the response status is 500 and the error message is returned
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Something went wrong: Database Error');
    expect(res._getJSONData().success).toBe(false);
    expect(res._getJSONData().error).toBe('Database Error');

    // Ensure that the Event.create method was called once
    expect(Event.create.calledOnce).toBe(true);
  });
});
