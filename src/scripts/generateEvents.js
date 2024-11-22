import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

const EVENT_TYPES = [
  'USER_LOGIN',
  'USER_LOGOUT',
  'PAYMENT_PROCESSED',
  'ORDER_CREATED',
  'ITEM_SHIPPED',
  'ACCOUNT_CREATED',
  'PASSWORD_CHANGED'
];

const SOURCE_APPS = [
  'web-frontend',
  'mobile-app',
  'payment-service',
  'shipping-service',
  'auth-service'
];

const generateEvent = () => ({
  eventType: EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)],
  sourceAppId: SOURCE_APPS[Math.floor(Math.random() * SOURCE_APPS.length)],
  payload: {
    userId: faker.string.uuid(),
    timestamp: new Date().toISOString(),
    details: {
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      location: faker.location.city()
    },
    metadata: {
      version: faker.system.semver(),
      environment: 'production'
    }
  }
});

const sendEvent = async (event) => {
  try {
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Event created with hash: ${data.hash}`);
  } catch (error) {
    console.error('Error sending event:', error);
  }
};

console.log('Starting event generation...');
setInterval(async () => {
  const event = generateEvent();
  await sendEvent(event);
}, 1000);