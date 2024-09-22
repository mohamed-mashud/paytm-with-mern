import { useSearchParams } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);

    return (
      <div className="flex justify-center h-screen bg-gray-50">
        <div className="flex flex-col justify-center h-full">
          <div className="border max-w-md w-96 p-6 space-y-8 bg-white shadow-lg rounded-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800">Send Money</h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{name}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  className="block w-full h-10 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>

              <button
                onClick={async() => {
                  await axios.post(`${import.meta.env.BACKEND_URL}/api/v1/bank/transfer`, {
                    reciever: id,
                    amount
                  }, {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token")
                    }
                  });
                }}
                className="block w-full h-10 rounded-md bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition duration-150 ease-in-out"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
