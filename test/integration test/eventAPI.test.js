
import request from 'supertest';
import app from '../../app.js';
import { Event } from '../../models';

describe('Event API', () => {
  describe('POST /api/v1/initialize', () => {
    beforeEach(async () => {
      await Event.deleteMany({});
    });

    it('should create a new event', async () => {
      const eventData = {
        name: 'Test Event',
        availableTickets: 100
      };

      const response = await request(app)
        .post('/api/v1/initialize')
        .send(eventData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Event created successfully');
      expect(response.body.event).toHaveProperty('name', eventData.name);
      expect(response.body.event).toHaveProperty('availableTickets', eventData.availableTickets);
    });

    it('should return 500 if something goes wrong', async () => {
      jest.spyOn(Event, 'create').mockRejectedValueOnce(new Error('Database error'));

      const eventData = {
        name: 'Test Event',
        availableTickets: 100
      };

      const response = await request(app)
        .post('/api/v1/initialize')
        .send(eventData)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Something went wrong');
    });
  });
});
