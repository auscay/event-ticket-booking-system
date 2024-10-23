import { cancelBooking } from '../booking/booking.controller'; 
import Booking from '../modelll/Booking'; 
import Event from '../modelll/Event'; 
import WaitingList from '../modelll/WaitingList'; 
import { sequelize } from '../db/index';
import sinon from 'sinon'; // Import Sinon for stubbing
import httpMocks from 'node-mocks-http'; // Utility to mock req and res

describe('cancelBooking Controller (using Sinon)', () => {
  let req, res, sandbox, transactionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Mock request and response
    req = httpMocks.createRequest({
      body: {
        userId: 1,
        eventId: 1,
      },
    });
    res = httpMocks.createResponse();

    // Stub models and sequelize transaction
    sandbox.stub(Booking, 'findOne');
    sandbox.stub(Booking.prototype, 'destroy');
    sandbox.stub(Booking, 'create');
    sandbox.stub(Event, 'findByPk');
    sandbox.stub(WaitingList, 'findOne');
    sandbox.stub(WaitingList.prototype, 'destroy');
    
    transactionStub = {
      commit: sinon.stub(),
      rollback: sinon.stub(),
    };
    sandbox.stub(sequelize, 'transaction').resolves(transactionStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should cancel booking and update available tickets when no one is in the waiting list', async () => {
    const mockEvent = {
      availableTickets: 0,
      save: sinon.stub().resolves(),
      toJSON: () => ({ id: 1, availableTickets: 0 }),
    };

    Booking.findOne.resolves({
      quantity: 5,
      destroy: sinon.stub().resolves(),
      toJSON: () => ({ userId: 1, eventId: 1, quantity: 5 }),
    });

    Event.findByPk.resolves(mockEvent);
    WaitingList.findOne.resolves(null); // No one in the waiting list

    // Call the controller function
    await cancelBooking(req, res);

    // Assert response and behavior
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().message).toBe('Booking cancelled successfully');
    expect(Event.findByPk.calledOnce).toBe(true);
    expect(mockEvent.save.calledOnce).toBe(true); // Check the mock event's save
    expect(mockEvent.availableTickets).toBe(5);   // Check available tickets
  });

  it('should transfer booking to next user in the waiting list and update remaining tickets', async () => {
    const mockEvent = {
      availableTickets: 0,
      save: sinon.stub().resolves(),
      toJSON: () => ({ id: 1, availableTickets: 0 }),
    };

    Booking.findOne.resolves({
      quantity: 5,
      destroy: sinon.stub().resolves(),
      toJSON: () => ({ userId: 1, eventId: 1, quantity: 5 }),
    });

    Event.findByPk.resolves(mockEvent);

    WaitingList.findOne.resolves({
      userId: 2,
      quantity: 3,
      destroy: sinon.stub().resolves(),
      toJSON: () => ({ userId: 2, quantity: 3 }),
    });

    Booking.create.resolves({
      userId: 2,
      eventId: 1,
      quantity: 3,
      status: 'booked',
    });

    // Call the controller function
    await cancelBooking(req, res);

    // Assert response and behavior
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().message).toBe('Booking cancelled successfully');
    expect(Booking.create.calledOnce).toBe(true);
    expect(Booking.create.calledWith({
      userId: 2,
      eventId: 1,
      quantity: 3,
      status: 'booked',
    })).toBe(true);
    expect(mockEvent.availableTickets).toBe(2); // 5 - 3 = 2 remaining
  });

  it('should handle errors and roll back transaction', async () => {
    Booking.findOne.rejects(new Error('Database error'));

    // Call the controller function
    await cancelBooking(req, res);

    // Assert response and rollback
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData().error).toContain('An error occurred while cancelling the booking');
    expect(sequelize.transaction.calledOnce).toBe(true);
    expect(transactionStub.rollback.calledOnce).toBe(true);  // Check rollback
  });
});
