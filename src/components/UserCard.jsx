import React from 'react';

const UserCard = ({user}) => {
  return (
    <section className="mb-2 border bg-neutral-100 p-4 rounded-lg max-w-full">
      <div className="mx-auto">
        <div className="card md:flex max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 md:mr-6 flex-shrink-0">
            <img className="object-cover rounded-full" src="https://tailwindflex.com/public/images/user.png" alt="User" />
          </div>
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl heading">{user.fname} {user.lname}</h3>
            <p className="mt-2 mb-3">{user.address}</p>
            <p className="mt-2 mb-3">{user.city} - {user.postcode}</p>
            <p className="mt-2 mb-3">{user.phone}</p>
            <p className="mt-2 mb-3">{user.countryCode}</p>
            <div>
              <span className="bg-gray-200 border px-3 py-1.5 rounded-lg text-sm">Loves: {user.favMammal}</span>
              <span className="bg-gray-200 border px-3 py-1.5 rounded-lg text-sm">Fan of the number {user.favNumber} </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserCard;
