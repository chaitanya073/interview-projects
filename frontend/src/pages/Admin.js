import { useEffect, useState } from 'react';
import UserInfo from '../components/UserInfo';
import BarGraph from '../components/Bargraph';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Admin = () => {
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null); // New state for filtered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await fetch('api/admin/', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        let json = await response.json();

        if (response.ok) {
          setUsers(json);
          console.log('Fetched users:', json);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (!users) {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [users, user]);

  useEffect(() => {
    // Filter users based on search input
    if (users) {
      if (search === null || search === '') {
        setFilteredUsers(users);
      } else {
        console.log(users);
        const regex = new RegExp(search, 'i');
        const filteredResults = users.filter((user) => regex.test(user._id));
        console.log('Filtered results:', filteredResults);
        setFilteredUsers(filteredResults);
      }
    }
  }, [search, users]);

  return (
    <div className="admin">
      {!users && <Link to="/">You are not admin</Link>}
      <div className="search-container">
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="content-container">
        <div className="tasks">
          {filteredUsers &&
            filteredUsers.map((filteredUser, index) => (
              <UserInfo user={filteredUser} token={user.token} key={index} />
            ))}
        </div>
        {users && <BarGraph data={users}></BarGraph>}
      </div>
    </div>
  );
};

export default Admin;
