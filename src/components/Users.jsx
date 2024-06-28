import React, { useEffect, useState } from 'react'

import UserCard  from './UserCard'
const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {   
        fetch('http://localhost:8000/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            setUsers(data)
        })
    }
    , [])
  return (
    <div>
        {users.map((user, index) => (
            <UserCard key={index} user={user} />
        ))}
    </div>
  )
}

export default Users