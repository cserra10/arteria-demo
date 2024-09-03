import type { NextRequest } from 'next/server';

import { logger } from 'src/utils/logger';
import { STATUS, response, handleError } from 'src/utils/response';

import { _events } from 'src/_mock/_event';

// ----------------------------------------------------------------------

export const runtime = 'edge';

type EventType = ReturnType<typeof _events>[number];

let clonedData: EventType[] = [];

/** **************************************
 * Get all events
 *************************************** */
export async function GET() {
  try {
    logger('Get events', clonedData.length);

    clonedData = _events();

    return response({ events: clonedData }, STATUS.OK);
  } catch (error) {
    return handleError('Event - Get all', error);
  }
}

/** **************************************
 * Create new event
 *************************************** */
export async function POST(req: NextRequest) {
  try {
    const { eventData: newEvent } = await req.json();

    clonedData.push(newEvent);
    const event = findEventById(clonedData, newEvent.id);

    logger('New event', event);
    logger('Update Events', clonedData.length);

    return response({ event }, STATUS.OK);
  } catch (error) {
    return handleError('Event - Create', error);
  }
}

/** **************************************
 * Update event
 *************************************** */
export async function PUT(req: NextRequest) {
  try {
    const { eventData: updateEvent } = await req.json();

    clonedData = updateEventList(clonedData, updateEvent);
    const eventUpdated = findEventById(clonedData, updateEvent.id);

    logger('Update event', eventUpdated);

    return response({ event: eventUpdated }, STATUS.OK);
  } catch (error) {
    return handleError('Event - Update', error);
  }
}

/** **************************************
 * Delete event
 *************************************** */
export async function PATCH(req: NextRequest) {
  try {
    const { eventId } = await req.json();

    clonedData = deleteEventById(clonedData, eventId);

    logger('Delete event', eventId);
    logger('Update Events', clonedData.length);

    return response({ eventId }, STATUS.OK);
  } catch (error) {
    return handleError('Event - Delete', error);
  }
}

/** **************************************
 * Actions & Utility
 *************************************** */

function findEventById(events: EventType[], eventId: string): EventType | undefined {
  return events.find((event) => event.id === eventId);
}

function updateEventList(events: EventType[], updatedEvent: EventType): EventType[] {
  return events.map((event) =>
    event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
  );
}

function deleteEventById(events: EventType[], eventId: string): EventType[] {
  return events.filter((event) => event.id !== eventId);
}
