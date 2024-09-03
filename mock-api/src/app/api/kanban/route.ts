import type { NextRequest } from 'next/server';

import { logger } from 'src/utils/logger';
import { STATUS, response, handleError } from 'src/utils/response';

import { _board } from 'src/_mock/_kanban';

// ----------------------------------------------------------------------

export const runtime = 'edge';

type BoardType = ReturnType<typeof _board>;

let clonedData: BoardType;

const ENDPOINTS = {
  CREATE_COLUMN: 'create-column',
  UPDATE_COLUMN: 'update-column',
  MOVE_COLUMN: 'move-column',
  CLEAR_COLUMN: 'clear-column',
  DELETE_COLUMN: 'delete-column',
  CREATE_TASK: 'create-task',
  UPDATE_TASK: 'update-task',
  MOVE_TASK: 'move-task',
  DELETE_TASK: 'delete-task',
};

/** **************************************
 * Get board
 *************************************** */
export async function GET() {
  try {
    clonedData = _board();

    return response({ board: clonedData }, STATUS.OK);
  } catch (error) {
    return handleError('Kanban - Get board', error);
  }
}

/** **************************************
 * POST:
 * create column
 * update column
 * move column
 * clear column
 * delete column
 * create task
 * update task
 * move task
 * delete task
 *************************************** */

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const endpoint = searchParams.get('endpoint');

  try {
    switch (endpoint) {
      case ENDPOINTS.CREATE_COLUMN:
        return await createColumn(req);
      case ENDPOINTS.UPDATE_COLUMN:
        return await updateColumn(req);
      case ENDPOINTS.MOVE_COLUMN:
        return await moveColumn(req);
      case ENDPOINTS.CLEAR_COLUMN:
        return await clearColumn(req);
      case ENDPOINTS.DELETE_COLUMN:
        return await deleteColumn(req);
      case ENDPOINTS.CREATE_TASK:
        return await addTask(req);
      case ENDPOINTS.UPDATE_TASK:
        return await updateTask(req);
      case ENDPOINTS.MOVE_TASK:
        return await moveTask(req);
      case ENDPOINTS.DELETE_TASK:
        return await deleteTask(req);
      default:
        return response({ message: 'Endpoint not found' }, STATUS.NOT_FOUND);
    }
  } catch (error) {
    return handleError(`Kanban - Post ${endpoint}`, error);
  }
}

/** **************************************
 * Actions & Utility
 *************************************** */

/**
 * COLUMN
 * Creates a new column in the board.
 */
async function createColumn(req: NextRequest) {
  const { columnData } = await req.json();

  // Immutable update to board columns and tasks.
  const newColumns = [...clonedData.columns, columnData];
  const newTasks = { ...clonedData.tasks, [columnData.id]: [] };

  // Update the board with the new state.
  clonedData.columns = newColumns;
  clonedData.tasks = newTasks;

  logger('Create column', clonedData.columns.length);

  return response({ column: columnData }, STATUS.OK);
}

/**
 * COLUMN
 * Updates the name of an existing column.
 */
async function updateColumn(req: NextRequest) {
  const { columnId, columnName } = await req.json();

  if (!columnId || !columnName) {
    return response({ message: 'Invalid column ID or name' }, STATUS.BAD_REQUEST);
  }

  // Find and update the specified column.
  const updatedColumns = clonedData.columns.map((column) =>
    column.id === columnId ? { ...column, name: columnName } : column
  );

  // Update the board with the new columns array.
  clonedData.columns = updatedColumns;

  // Find the updated column to return it in the response.
  const updatedColumn = updatedColumns.find((column) => column.id === columnId);

  logger('Updated column', clonedData.columns, true);

  return response({ column: updatedColumn }, STATUS.OK);
}

/**
 * COLUMN
 * Moves a column within the board.
 */
async function moveColumn(req: NextRequest) {
  const { updateColumns } = await req.json();

  // Directly update the board's columns with the new order.
  clonedData.columns = updateColumns;

  return response({ columns: clonedData.columns }, STATUS.OK);
}

/**
 * COLUMN
 * Clears all tasks from a specified column.
 */
async function clearColumn(req: NextRequest) {
  const { columnId } = await req.json();

  // Remove all tasks from the specified column.
  clonedData.tasks[columnId] = [];

  logger('Clear column', clonedData.tasks[columnId]);

  return response({ columnId }, STATUS.OK);
}

/**
 * COLUMN
 * Deletes a column and its associated tasks.
 */
async function deleteColumn(req: NextRequest) {
  const { columnId } = await req.json();

  // Filter out the column to be deleted.
  clonedData.columns = clonedData.columns.filter((column) => column.id !== columnId);

  // Remove the tasks associated with the deleted column.
  delete clonedData.tasks[columnId];

  logger('Delete column', clonedData.columns.length);

  return response({ columnId }, STATUS.OK);
}

/**
 * TASKS
 * Adds a new task to a specific column.
 */
async function addTask(req: NextRequest) {
  const { columnId, taskData } = await req.json();

  // Add the new task at the beginning of the specified column's task array
  clonedData.tasks[columnId] = [taskData, ...(clonedData.tasks[columnId] || [])];

  logger('Add task', clonedData.tasks[columnId].length);

  return response({ columnId, taskData }, STATUS.OK);
}

/**
 * TASKS
 * Updates an existing task within a specific column
 */
async function updateTask(req: NextRequest) {
  const { columnId, taskData } = await req.json();

  // Map through tasks in the specified column to find and update the task
  const updatedTasks = clonedData.tasks[columnId].map((task) =>
    task.id === taskData.id ? { ...task, ...taskData } : task
  );

  // Update the tasks array for the specified column
  clonedData.tasks[columnId] = updatedTasks;

  // Find and return the updated task
  const updatedTask = updatedTasks.find((task) => task.id === taskData.id);

  logger('Add task', updatedTask.name);

  return response({ task: updatedTask }, STATUS.OK);
}

/**
 * TASKS
 * Moves a task from one column to another or within the same column
 */
async function moveTask(req: NextRequest) {
  const { updateTasks } = await req.json();

  // Update the entire tasks structure with the new one
  clonedData.tasks = updateTasks;

  return response({ columns: clonedData.tasks }, STATUS.OK);
}

/**
 * TASKS
 * Deletes a task from a specific column
 */
async function deleteTask(req: NextRequest) {
  const { columnId, taskId } = await req.json();

  // Filter out the task to be deleted from the specified column
  clonedData.tasks[columnId] = clonedData.tasks[columnId].filter((task) => task.id !== taskId);

  logger('Delete task', clonedData.tasks[columnId].length);

  return response({ columnId, taskId }, STATUS.OK);
}
