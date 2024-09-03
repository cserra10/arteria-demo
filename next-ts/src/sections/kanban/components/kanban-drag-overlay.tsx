import type { Theme, SxProps } from '@mui/material/styles';
import type { DropAnimation, UniqueIdentifier } from '@dnd-kit/core';
import type { IKanban, IKanbanTask, IKanbanColumn } from 'src/types/kanban';

import { DragOverlay as DndDragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';

import Portal from '@mui/material/Portal';

import ItemBase from '../item/item-base';
import ColumnBase from '../column/column-base';
import { KanbanColumnToolBar } from '../column/kanban-column-toolbar';

// ----------------------------------------------------------------------

type KanbanDragOverlayProps = Pick<IKanban, 'tasks' | 'columns'> & {
  activeId: UniqueIdentifier | null;
  sx?: SxProps<Theme>;
};

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
};

export function KanbanDragOverlay({ columns, tasks, activeId, sx }: KanbanDragOverlayProps) {
  const columnIds = columns.map((column) => column.id);

  const activeColumn = columns.find((column) => column.id === activeId) as IKanbanColumn;

  const allTasks = Object.values(tasks).flat();

  const activeTask = allTasks.find((task) => task.id === activeId) as IKanbanTask;

  return (
    <Portal>
      <DndDragOverlay adjustScale={false} dropAnimation={dropAnimation}>
        {activeId ? (
          <>
            {columnIds.includes(activeId) ? (
              <ColumnOverlay column={activeColumn} tasks={tasks[activeId]} sx={sx} />
            ) : (
              <TaskItemOverlay task={activeTask} sx={sx} />
            )}
          </>
        ) : null}
      </DndDragOverlay>
    </Portal>
  );
}

// ----------------------------------------------------------------------

type ColumnOverlayProps = {
  column: IKanbanColumn;
  tasks: IKanbanTask[];
  sx?: SxProps<Theme>;
};

export function ColumnOverlay({ column, tasks, sx }: ColumnOverlayProps) {
  return (
    <ColumnBase
      slots={{
        header: <KanbanColumnToolBar columnName={column.name} totalTasks={tasks.length} />,
        main: tasks.map((task) => <ItemBase key={task.id} task={task} />),
      }}
      stateProps={{ dragOverlay: true }}
      sx={sx}
    />
  );
}

// ----------------------------------------------------------------------

type TaskItemOverlayProps = {
  task: IKanbanTask;
  sx?: SxProps<Theme>;
};

export function TaskItemOverlay({ task, sx }: TaskItemOverlayProps) {
  return <ItemBase task={task} sx={sx} stateProps={{ dragOverlay: true }} />;
}
