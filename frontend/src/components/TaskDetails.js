import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch('/api/tasks/' + task._id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_TASK', payload: json });
    }
  };

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    let newStatus = task.status;
    if (newStatus) {
      newStatus = false;
    } else {
      newStatus = true;
    }

    const response = await fetch('/api/tasks/' + task._id, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      console.log(json);
      dispatch({ type: 'UPDATE_TASK', payload: json });
    }
  };

  return (
    <div className="task-details">
      <h4>{task.title}</h4>
      <p>
        <strong>Description : </strong>
        {task.description}
      </p>
      <p>
        <strong>Due Date : </strong>
        {task.dueDate}
        {' ['}
        {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        {']'}
      </p>
      <p>
        <strong>Created : </strong>
        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
      </p>
      <p>
        {' '}
        <strong>Assigned To :</strong>
        {task.assignedUser}
      </p>
      <p>
        <button onClick={handleUpdate}>
          {task.status ? 'Ongoing' : 'Completed'}
        </button>
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default TaskDetails;
