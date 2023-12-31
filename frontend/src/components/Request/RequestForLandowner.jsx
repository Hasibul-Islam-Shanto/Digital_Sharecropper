import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../Context/ApiContext';
import Loader from '../../components/Loader';

const RequestForLandowner = () => {
  const [loading, setLoading] = useState(false);
  const { reqLand, getOwnerLand } = useContext(ApiContext);

  const landOwnerLandReq = async () => {
    setLoading(true);
    await getOwnerLand();
    setLoading(false);
  };
  useEffect(() => {
    landOwnerLandReq();
  }, []);
  return (
    <React.Fragment>
      {loading ? (
        <Loader />
      ) : (
        <table className="w-full table-auto border-[1px] mt-3">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              {/* <th className="py-3 px-6 text-center"></th> */}
              <th className="py-3 px-6 text-center">Land ID</th>
              <th className="py-3 px-6 text-center">Land Amount</th>
              <th className="py-3 px-6 text-center">Land location</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-md">
            {reqLand.map((req) => (
              <tr
                key={req.Record.Key}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {req.Record.LandId}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {req.Record.LandAmount}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {req.Record.LandLocation}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  {req.Record.ReqTime}
                </td>
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <button
                    className={`${
                      req.Record.Status == 'pending'
                        ? 'bg-red-400'
                        : 'bg-[#42A045]'
                    } px-2 py-1 text-white rounded-md`}
                  >
                    {req.Record.Status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </React.Fragment>
  );
};

export default RequestForLandowner;
