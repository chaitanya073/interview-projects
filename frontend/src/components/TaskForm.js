import { useState, useEffect } from 'react';
import { useTasksContext } from '../hooks/useTasksContext';
import { useAuthContext } from '../hooks/useAuthContext';

const TaskForm = () => {
  const { dispatch } = useTasksContext();
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [options, setOptions] = useState([]);

  const fetchOptions = () => {
    fetch('api/tasks/getusers', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((response) => response.json())
      .then((data) => setOptions(data.usersArray))
      .catch((error) => console.error('Error fetching options:', error));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    const task = { title, description, dueDate, assignedUser };
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedUser('');
      setError(null);
      setEmptyFields([]);
      dispatch({ type: 'CREATE_TASK', payload: json });
    }
  };

  const handleOptionChange = (e) => {
    setAssignedUser(e.target.value);
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Task</h3>
      <label>Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />
      <label>Description :</label>
      <input
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
      />
      <label>Due Date :</label>
      <input
        type="date"
        onChange={(e) => setDueDate(e.target.value)}
        value={dueDate}
        className={emptyFields.includes('due date') ? 'error' : ''}
      />
      <label>Assigned to :</label>
      <div className="select-container">
        <select
          value={assignedUser}
          onChange={handleOptionChange}
          className={emptyFields.includes('assigned to') ? 'error' : ''}
        >
          <option value="">Select an option</option>
          {options &&
            options.map((option, index) => (
              <option key={index + 1} value={option}>
                {option}
              </option>
            ))}
        </select>
      </div>
      <button>Add Task</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TaskForm;
