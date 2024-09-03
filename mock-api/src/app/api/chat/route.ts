import type { NextRequest } from 'next/server';

import { logger } from 'src/utils/logger';
import { STATUS, response, handleError } from 'src/utils/response';

import { _contacts, _conversations } from 'src/_mock/_chat';

// ----------------------------------------------------------------------

export const runtime = 'edge';

type ConversationType = ReturnType<typeof _conversations>[number];

let clonedData: ConversationType[] = [];

const ENDPOINTS = {
  CONVERSATIONS: 'conversations',
  CONVERSATION: 'conversation',
  MARK_AS_SEEN: 'mark-as-seen',
  CONTACTS: 'contacts',
};

/** **************************************
 * GET:
 * conversations
 * conversation
 * mark-as-seen
 * contacts
 *************************************** */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const endpoint = searchParams.get('endpoint');

  try {
    switch (endpoint) {
      case ENDPOINTS.CONVERSATIONS:
        return await getConversations();
      case ENDPOINTS.CONVERSATION:
        return await getConversation(req);
      case ENDPOINTS.MARK_AS_SEEN:
        return await markAsSeen(req);
      case ENDPOINTS.CONTACTS:
        return await getContacts();
      default:
        return response({ message: 'Endpoint not found' }, STATUS.NOT_FOUND);
    }
  } catch (error) {
    return handleError(`Chat - Get ${endpoint}`, error);
  }
}

/** **************************************
 * Create new conversation
 *************************************** */
export async function POST(req: NextRequest) {
  try {
    const { conversationData: newConversation } = await req.json();

    clonedData.push(newConversation);

    logger('Conversations', clonedData.length);

    return response({ conversation: newConversation }, STATUS.OK);
  } catch (error) {
    return handleError('Chat - Create conversation', error);
  }
}

/** **************************************
 * Update conversation
 *************************************** */
export async function PUT(req: NextRequest) {
  try {
    const { conversationId, messageData } = await req.json();

    const conversationIndex = clonedData.findIndex((conv) => conv.id === conversationId);

    if (conversationIndex === -1) {
      return response({ message: 'Conversation not found!' }, STATUS.NOT_FOUND);
    }

    clonedData[conversationIndex].messages.push(messageData);

    logger('Update conversation', clonedData[conversationIndex].messages, true);

    return response({ conversation: clonedData[conversationIndex] }, STATUS.OK);
  } catch (error) {
    return handleError('Chat - Update conversation', error);
  }
}

/** **************************************
 * Actions & Utility
 *************************************** */

async function getContacts() {
  return response({ contacts: _contacts() }, STATUS.OK);
}

async function getConversations() {
  clonedData = _conversations();

  return response({ conversations: clonedData }, STATUS.OK);
}

async function getConversation(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const conversationId = searchParams.get('conversationId');
  const conversation = clonedData.find((conv) => conv.id === conversationId);

  if (!conversation) {
    return response({ message: 'Conversation not found!' }, STATUS.NOT_FOUND);
  }

  return response({ conversation }, STATUS.OK);
}

async function markAsSeen(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const conversationId = searchParams.get('conversationId');

  const conversationIndex = clonedData.findIndex((conv) => conv.id === conversationId);

  if (conversationIndex === -1) {
    return response({ message: 'Conversation not found!' }, STATUS.NOT_FOUND);
  }

  clonedData[conversationIndex].unreadCount = 0;

  return response({ conversationId }, STATUS.OK);
}
