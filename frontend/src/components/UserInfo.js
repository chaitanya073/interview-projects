import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const UserInfo = ({ user, token }) => {
  const handleTaskDelete = async (id) => {
    const response = await fetch(`/api/admin/${user.user._id}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response.ok);
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <div className="task-details">
      <h4>Email : {user._id}</h4>
      <p>
        <strong>Total Task : </strong> {user.count}
      </p>
      {user.tasks &&
        user.tasks.map((task, index) => (
          <div>
            <h4>
              {index + 1} : {task.title}
            </h4>
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
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
              })}
            </p>
            <button onClick={() => handleTaskDelete(task._id)} className="btn">
              Delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default UserInfo;
