import { bookTicket } from '../booking/booking.controller'; 
import Booking from '../modelll/Booking'; 
import Event from '../modelll/Event'; 
import WaitingList from '../modelll/WaitingList'; 
import { sequelize } from '../db/index';
import sinon from 'sinon'; // Import Sinon for stubbing
import httpMocks from 'node-mocks-http'; // Utility to mock req and res

describe('bookTicket Controller (using Sinon)', () => {
  let req, res, sandbox, transactionStub;

  beforeEach(() => {
    // Create a sandbox for Sinon
    sandbox = sinon.createSandbox();

    // Mock the request and response using `node-mocks-http`
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();

    // Setup default body in request
    req.body = {
      eventId: 1,
      userId: 123,
      quantity: 2,
    };

    // Stub the transaction object and its methods
    transactionStub = {
      commit: sandbox.stub(),
      rollback: sandbox.stub(),
    };

    // Stub sequelize.transaction to return the mocked transaction
    sandbox.stub(sequelize, 'transaction').resolves(transactionStub);
  });

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore();
  });

  it('should book the ticket if enough tickets are available', async () => {
    // Step 1: Stub the Event.findByPk method to return a mock event with available tickets
    const eventStub = sandbox.stub(Event, 'findByPk').resolves({
      id: 1,
      name: 'Sample Event',
      availableTickets: 5,
      save: sandbox.stub().resolves(),
    });

    // Step 2: Stub the Booking.create method to simulate booking creation
    const bookingStub = sandbox.stub(Booking, 'create').resolves({
      id: 1,
      eventId: 1,
      userId: 123,
      quantity: 2,
    });

    // Step 3: Call the bookTicket function
    await bookTicket(req, res);

    // Step 4: Assertions
    expect(res.statusCode).toBe(201); // Expect success status
    const jsonResponse = res._getJSONData();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toBe('Ticket booked successfully');
    expect(jsonResponse.booking).toEqual({
      id: 1,
      eventId: 1,
      userId: 123,
      quantity: 2,
    });

    // Step 5: Verify that the transaction was committed
    sinon.assert.calledOnce(transactionStub.commit);

    // Step 6: Ensure the Event and Booking stubs were called with the right arguments
    sinon.assert.calledOnce(eventStub);
    sinon.assert.calledWith(eventStub, 1, { lock: true, transaction: transactionStub });
    sinon.assert.calledOnce(bookingStub);
    sinon.assert.calledWith(bookingStub, {
      eventId: 1,
      userId: 123,
      quantity: 2,
    }, { transaction: transactionStub });
  });

  it('should add the user to the waiting list if not enough tickets are available', async () => {
    // Step 1: Stub the Event.findByPk method to return an event with fewer tickets than requested
    const eventStub = sandbox.stub(Event, 'findByPk').resolves({
      id: 1,
      name: 'Sample Event',
      availableTickets: 1,
      save: sandbox.stub().resolves(),
    });

    // Step 2: Stub the WaitingList.create method to simulate adding to waiting list
    const waitingListStub = sandbox.stub(WaitingList, 'create').resolves({
      id: 1,
      eventId: 1,
      userId: 123,
      quantity: 2,
    });

    // Step 3: Call the bookTicket function
    await bookTicket(req, res);

    // Step 4: Assertions
    expect(res.statusCode).toBe(200); // Expect success with a waiting list response
    const jsonResponse = res._getJSONData();
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toBe(
      'Not enough tickets available. You have been added to the waiting list.'
    );
    expect(jsonResponse.waitingListEntry).toEqual({
      id: 1,
      eventId: 1,
      userId: 123,
      quantity: 2,
    });

    // Step 5: Verify that the transaction was committed
    sinon.assert.calledOnce(transactionStub.commit);

    // Step 6: Ensure the Event and WaitingList stubs were called
    sinon.assert.calledOnce(eventStub);
    sinon.assert.calledWith(eventStub, 1, { lock: true, transaction: transactionStub });
    sinon.assert.calledOnce(waitingListStub);
    sinon.assert.calledWith(waitingListStub, {
      eventId: 1,
      userId: 123,
      quantity: 2,
    }, { transaction: transactionStub });
  });

  it('should handle errors and roll back the transaction', async () => {
    // Step 1: Stub the Event.findByPk method to throw an error
    const eventStub = sandbox.stub(Event, 'findByPk').throws(new Error('Database error'));

    // Step 2: Call the bookTicket function
    await bookTicket(req, res);

    // Step 3: Assertions
    expect(res.statusCode).toBe(500); // Expect server error status
    const jsonResponse = res._getJSONData();
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toContain('Something went wrong: Database error');

    // Step 4: Ensure that the transaction was rolled back
    sinon.assert.calledOnce(transactionStub.rollback);

    // Step 5: Ensure Event.findByPk was called but failed
    sinon.assert.calledOnce(eventStub);
  });
});
