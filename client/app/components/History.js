import React from "react";

function History() {
  return (
    <div className="history-component p-4 bg-gray-100 rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Chat History
      </h2>
      {/* Display the chat history here */}
      <ul className="list-disc pl-5 space-y-2">
        <li className="text-gray-600 hover:text-gray-900 transition duration-300">
          History Item 1
        </li>
        <li className="text-gray-600 hover:text-gray-900 transition duration-300">
          History Item 2
        </li>
        <li className="text-gray-600 hover:text-gray-900 transition duration-300">
          History Item 3
        </li>
        {/* Add more history items as needed */}
      </ul>
    </div>
  );
}

export default History;
