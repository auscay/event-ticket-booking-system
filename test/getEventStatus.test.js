import { getEventStatus } from '../events/event.controller'; // Import the controller
import Event from '../modelll/Event'; // Import the Event model
import WaitingList from '../modelll/WaitingList'; // Import the WaitingList model
import httpMocks from 'node-mocks-http'; // Utility to mock req and res
import sinon from 'sinon'; // Sinon for stubbing

describe('getEventStatus Controller', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock request and response
    req = httpMocks.createRequest({
      params: {
        eventId: 1, // Assuming eventId is passed as a URL param
      },
    });
    res = httpMocks.createResponse();

    // Stub the models
    sandbox.stub(Event, 'findByPk');
    sandbox.stub(WaitingList, 'count');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return event status successfully', async () => {
    // Mock the Event and WaitingList.count methods
    Event.findByPk.resolves({
      name: 'Test Event',
      availableTickets: 50,
    });
    WaitingList.count.resolves(10);

    // Call the controller function
    await getEventStatus(req, res);

    // Assert that the response status is 200 and the correct event status is returned
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().message).toBe('Event status retrieved successfully');
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().event.name).toBe('Test Event');
    expect(res._getJSONData().event.availableTickets).toBe(50);
    expect(res._getJSONData().event.waitingListCount).toBe(10);

    // Ensure that the findByPk and count methods were called
    expect(Event.findByPk.calledOnce).toBe(true);
    expect(WaitingList.count.calledOnce).toBe(true);
  });

  it('should return 400 if eventId is not provided', async () => {
    // Remove eventId from request params to simulate missing eventId
    req.params = {};

    // Call the controller function
    await getEventStatus(req, res);

    // Assert that the response status is 400 and an appropriate message is returned
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Event ID is required.');
    expect(res._getJSONData().success).toBe(false);

    // Ensure that findByPk and count methods were never called
    expect(Event.findByPk.notCalled).toBe(true);
    expect(WaitingList.count.notCalled).toBe(true);
  });

  it('should return 404 if the event is not found', async () => {
    // Mock the Event.findByPk to return null, simulating event not found
    Event.findByPk.resolves(null);

    // Call the controller function
    await getEventStatus(req, res);

    // Assert that the response status is 404 and the correct error message is returned
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData().message).toBe('Event with ID 1 not found.');
    expect(res._getJSONData().success).toBe(false);

    // Ensure that the count method is not called since the event doesn't exist
    expect(WaitingList.count.notCalled).toBe(true);
  });

  it('should handle errors and return a 500 status', async () => {
    // Mock the Event.findByPk to throw an error
    Event.findByPk.rejects(new Error('Database error'));

    // Call the controller function
    await getEventStatus(req, res);

    // Assert that the response status is 500 and the correct error message is returned
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().message).toBe('Something went wrong: Database error');
    expect(res._getJSONData().success).toBe(false);
    expect(res._getJSONData().error).toBe('Database error');

    // Ensure that the findByPk method was called once
    expect(Event.findByPk.calledOnce).toBe(true);
  });
});
