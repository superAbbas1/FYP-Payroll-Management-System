// src/context/UserProvider.jsx
import React, { useState } from 'react';
import UserContext from './UserContext'; // Correct path

const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
