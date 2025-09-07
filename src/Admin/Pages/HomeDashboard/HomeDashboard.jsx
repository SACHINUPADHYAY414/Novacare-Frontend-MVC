import React from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="container d-flex flex-column justify-content-center" style={{ minHeight: '100%' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-12 col-md-8 text-center">
          <h1 className="display-4 mb-3">
            Welcome {user?.name || 'Guest'}!
          </h1>
          <p className="lead mb-4">
            Manage your projects, track progress, and stay updated all in one place.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeDashboard;
