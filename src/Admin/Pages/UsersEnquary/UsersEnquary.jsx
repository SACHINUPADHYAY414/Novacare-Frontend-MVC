import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../../Components/Action/Api";
import { RiDeleteBinLine } from "react-icons/ri";

const UsersEnquary = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await api.get("/api/contact-us/all");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
      }
    }
    fetchMessages();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(messages.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentMessages = messages.slice(startIndex, startIndex + rowsPerPage);

  return (
      <div className="my-2">
      <div className="justify-content-start align-items-center text-start mb-2">
        <h4 className="text-muted mb-0">Users Enquary</h4>

      </div>
      <div className="table-responsive rounded">
        <table className="table table-striped table-bordered table-hover text-center mb-0">
          <thead className="table-primary">
            <tr>
              <th className="align-middle text-nowrap">S.No</th>
              <th className="align-middle text-nowrap">Name</th>
              <th className="align-middle text-nowrap">Email</th>
              <th className="align-middle text-nowrap">Message</th>
              <th className="align-middle text-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMessages.length === 0 ? (
              <tr>
                <td colSpan={5}>No messages found.</td>
              </tr>
            ) : (
              currentMessages.map(({ id, name, email, message }, idx) => (
                <tr key={id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{message}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Delete</Tooltip>}
                    >
                      <RiDeleteBinLine
                        size={22}
                        className="text-danger cursor-pointer"
                        //    onClick={() => handleDelete()}
                      />
                    </OverlayTrigger>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Previous</Tooltip>}
            >
              <span
                role="button"
                tabIndex={0}
                className={`cursor-pointer ${
                  currentPage === 1 ? "text-muted" : "text-primary"
                }`}
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    currentPage > 1 && setCurrentPage(currentPage - 1);
                }}
              >
                <FaChevronLeft size={20} />
              </span>
            </OverlayTrigger>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <OverlayTrigger placement="top" overlay={<Tooltip>Next</Tooltip>}>
              <span
                role="button"
                tabIndex={0}
                className={`cursor-pointer ${
                  currentPage === totalPages ? "text-muted" : "text-primary"
                }`}
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    currentPage < totalPages && setCurrentPage(currentPage + 1);
                }}
              >
                <FaChevronRight size={20} />
              </span>
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersEnquary;
