import React, { useEffect, useState } from 'react';
import { useToastr } from '../../../Components/Toastr/ToastrProvider';
import api from '../../../Components/Action/Api';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Doctors = () => {
  const { customToast } = useToastr();
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/api/doctor/all');
      setDoctors(response.data || []);
    } catch (error) {
      customToast({
        severity: 'error',
        summary: 'Oops!',
        detail: error.response?.data?.message || 'Failed to fetch doctors.',
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className='my-2'>
       <h4 className="text-muted mb-1">Doctors List</h4>
        <div className="table-responsive rounded mx-1">
          <table className="table table-striped table-bordered table-hover text-center mb-0 align-middle text-nowrap">
            <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Qualification</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.length > 0 ? (
              currentDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.name}</td>
                  <td>{doc.specialization?.name || doc.specializationName || '-'}</td>
                  <td>{doc.qualification || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4'>No doctors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      
       {/* Icon Pagination */}
      {totalPages > 1 && (
        <div className='d-flex justify-content-center align-items-center mt-3 gap-1'>
          <OverlayTrigger placement="top" overlay={<Tooltip>Previous</Tooltip>}>
          <FaChevronLeft
            size={20}
            className={`cursor-pointer ${currentPage === 1 ? 'text-muted' : 'text-primary'}`}
            onClick={handlePrev}
          />
          </OverlayTrigger> 
          <span>
            Page {currentPage} of {totalPages}
          </span>
           <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
            <FaChevronRight
            size={20}
            className={`cursor-pointer ${currentPage === totalPages ? 'text-muted' : 'text-primary'}`}
            onClick={handleNext}
          />
           </OverlayTrigger>
         
        </div>
      )}</div>

     
    </div>
  );
};

export default Doctors;
