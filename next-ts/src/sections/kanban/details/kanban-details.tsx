import type { IKanbanTask } from 'src/types/kanban';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomTabs } from 'src/components/custom-tabs';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { KanbanDetailsToolbar } from './kanban-details-toolbar';
import { KanbanInputName } from '../components/kanban-input-name';
import { KanbanDetailsPriority } from './kanban-details-priority';
import { KanbanDetailsAttachments } from './kanban-details-attachments';
import { KanbanDetailsCommentList } from './kanban-details-comment-list';
import { KanbanDetailsCommentInput } from './kanban-details-comment-input';
import { KanbanContactsDialog } from '../components/kanban-contacts-dialog';

// ----------------------------------------------------------------------

const SUBTASKS = [
  'Complete project proposal',
  'Conduct market research',
  'Design user interface mockups',
  'Develop backend api',
  'Implement authentication system',
];

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

type Props = {
  task: IKanbanTask;
  openDetails: boolean;
  onDeleteTask: () => void;
  onCloseDetails: () => void;
  onUpdateTask: (updateTask: IKanbanTask) => void;
};

export function KanbanDetails({
  task,
  openDetails,
  onUpdateTask,
  onDeleteTask,
  onCloseDetails,
}: Props) {
  const tabs = useTabs('overview');

  const [priority, setPriority] = useState(task.priority);

  const [taskName, setTaskName] = useState(task.name);

  const [subtaskCompleted, setSubtaskCompleted] = useState(SUBTASKS.slice(0, 2));

  const like = useBoolean();

  const contacts = useBoolean();

  const [taskDescription, setTaskDescription] = useState(task.description);

  const rangePicker = useDateRangePicker(dayjs(task.due[0]), dayjs(task.due[1]));

  const handleChangeTaskName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  }, []);

  const handleUpdateTask = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {
          if (taskName) {
            onUpdateTask({ ...task, name: taskName });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateTask, task, taskName]
  );

  const handleChangeTaskDescription = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  }, []);

  const handleChangePriority = useCallback((newValue: string) => {
    setPriority(newValue);
  }, []);

  const handleClickSubtaskComplete = (taskId: string) => {
    const selected = subtaskCompleted.includes(taskId)
      ? subtaskCompleted.filter((value) => value !== taskId)
      : [...subtaskCompleted, taskId];

    setSubtaskCompleted(selected);
  };

  const renderToolbar = (
    <KanbanDetailsToolbar
      liked={like.value}
      taskName={task.name}
      onLike={like.onToggle}
      onDelete={onDeleteTask}
      taskStatus={task.status}
      onCloseDetails={onCloseDetails}
    />
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {[
        { value: 'overview', label: 'Overview' },
        { value: 'subTasks', label: 'Subtasks' },
        { value: 'comments', label: `Comments (${task.comments.length})` },
      ].map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const renderTabOverview = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Task name */}
      <KanbanInputName
        placeholder="Task name"
        value={taskName}
        onChange={handleChangeTaskName}
        onKeyUp={handleUpdateTask}
        inputProps={{ id: `input-task-${taskName}` }}
      />

      {/* Reporter */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Reporter</StyledLabel>
        <Avatar alt={task.reporter.name} src={task.reporter.avatarUrl} />
      </Box>

      {/* Assignee */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Assignee</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {task.assignee.map((user) => (
            <Avatar key={user.id} alt={user.name} src={user.avatarUrl} />
          ))}

          <Tooltip title="Add assignee">
            <IconButton
              onClick={contacts.onTrue}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>

          <KanbanContactsDialog
            assignee={task.assignee}
            open={contacts.value}
            onClose={contacts.onFalse}
          />
        </Box>
      </Box>

      {/* Label */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 24, lineHeight: '24px' }}>Labels</StyledLabel>

        {!!task.labels.length && (
          <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
            {task.labels.map((label) => (
              <Chip key={label} color="info" label={label} size="small" variant="soft" />
            ))}
          </Box>
        )}
      </Box>

      {/* Due date */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel> Due date </StyledLabel>

        {rangePicker.selected ? (
          <Button size="small" onClick={rangePicker.onOpen}>
            {rangePicker.shortLabel}
          </Button>
        ) : (
          <Tooltip title="Add due date">
            <IconButton
              onClick={rangePicker.onOpen}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          </Tooltip>
        )}

        <CustomDateRangePicker
          variant="calendar"
          title="Choose due date"
          startDate={rangePicker.startDate}
          endDate={rangePicker.endDate}
          onChangeStartDate={rangePicker.onChangeStartDate}
          onChangeEndDate={rangePicker.onChangeEndDate}
          open={rangePicker.open}
          onClose={rangePicker.onClose}
          selected={rangePicker.selected}
          error={rangePicker.error}
        />
      </Box>

      {/* Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Priority</StyledLabel>
        <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
      </Box>

      {/* Description */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel> Description </StyledLabel>
        <TextField
          fullWidth
          multiline
          size="small"
          minRows={4}
          value={taskDescription}
          onChange={handleChangeTaskDescription}
          InputProps={{ sx: { typography: 'body2' } }}
        />
      </Box>

      {/* Attachments */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel>Attachments</StyledLabel>
        <KanbanDetailsAttachments attachments={task.attachments} />
      </Box>
    </Box>
  );

  const renderTabSubtasks = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <div>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {subtaskCompleted.length} of {SUBTASKS.length}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={(subtaskCompleted.length / SUBTASKS.length) * 100}
        />
      </div>

      <FormGroup>
        {SUBTASKS.map((taskItem) => (
          <FormControlLabel
            key={taskItem}
            control={
              <Checkbox
                disableRipple
                name={taskItem}
                checked={subtaskCompleted.includes(taskItem)}
              />
            }
            label={taskItem}
            onChange={() => handleClickSubtaskComplete(taskItem)}
          />
        ))}
      </FormGroup>

      <Button
        variant="outlined"
        startIcon={<Iconify icon="mingcute:add-line" />}
        sx={{ alignSelf: 'flex-start' }}
      >
        Subtask
      </Button>
    </Box>
  );

  const renderTabComments = (
    <>{!!task.comments.length && <KanbanDetailsCommentList comments={task.comments} />}</>
  );

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}
    >
      {renderToolbar}

      {renderTabs}

      <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
        {tabs.value === 'overview' && renderTabOverview}
        {tabs.value === 'subTasks' && renderTabSubtasks}
        {tabs.value === 'comments' && renderTabComments}
      </Scrollbar>

      {tabs.value === 'comments' && <KanbanDetailsCommentInput />}
    </Drawer>
  );
}
