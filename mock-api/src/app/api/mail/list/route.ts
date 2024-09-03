import type { NextRequest } from 'next/server';

import { logger } from 'src/utils/logger';
import { STATUS, response, handleError } from 'src/utils/response';

import { _mails, _labels } from 'src/_mock/_mail';

// ----------------------------------------------------------------------

export const runtime = 'edge';

type MailType = ReturnType<typeof _mails>[number];

/** **************************************
 * Get mails by labelId
 *************************************** */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const labelId = searchParams.get('labelId');

    const labels = _labels();
    const mails = _mails();

    logger('labelId', labelId);

    // Check if label exists
    const labelExists = labels.some((label) => label.id === labelId);

    if (!labelExists) {
      return response({ message: 'Label not found!' }, STATUS.NOT_FOUND);
    }

    // Directly check if labelId is for a custom label
    const isCustomLabel = labels.some((label) => label.id === labelId && label.type === 'custom');

    let filteredMails = [];

    if (isCustomLabel) {
      filteredMails = mails.filter((mail) => labelId !== null && mail.labelIds.includes(labelId));
    } else {
      filteredMails = filterMailsByLabelId(mails, labelId);
    }

    logger(`Mails - ${labelId}`, filteredMails.length);

    return response({ mails: filteredMails }, STATUS.OK);
  } catch (error) {
    return handleError('Mail - Get list', error);
  }
}

/** **************************************
 * Actions & Utility
 *************************************** */
function filterMailsByLabelId(mails: MailType[], labelId?: string | null) {
  switch (labelId) {
    case undefined:
    case 'inbox':
      return mails.filter((mail) => mail.folder === 'inbox');
    case 'all':
      return mails;
    case 'starred':
      return mails.filter((mail) => mail.isStarred);
    case 'important':
      return mails.filter((mail) => mail.isImportant);
    default:
      return mails.filter((mail) => mail.folder === labelId);
  }
}
