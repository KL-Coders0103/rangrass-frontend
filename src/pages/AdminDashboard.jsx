import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {

  const [ticket, setTicket] = useState("");
  const [category, setCategory] = useState("VIP");

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [listed, setListed] = useState([]);
  const [sold, setSold] = useState([]);

  const [selectedListed, setSelectedListed] = useState([]);
  const [selectedSold, setSelectedSold] = useState([]);


  // ================= LOAD =================
  const load = async () => {

    const l = await axios.get(
      "https://rangrass-backend.onrender.com/admin/unsold"
    );

    const s = await axios.get(
      "https://rangrass-backend.onrender.com/admin/sold"
    );

    setListed(l.data);
    setSold(s.data);
  };

  useEffect(() => { load(); }, []);


  // ================= ADD SINGLE =================
  const createSingle = async () => {

    await axios.post(
      "https://rangrass-backend.onrender.com/admin/create-single",
      { ticketNumber: ticket, category }
    );

    alert("Single ticket created");
    setTicket("");
    load();
  };


  // ================= ADD SERIES =================
  const createSeries = async () => {

    await axios.post(
      "https://rangrass-backend.onrender.com/admin/create-series",
      { start, end, category }
    );

    alert("Series created");
    setStart("");
    setEnd("");
    load();
  };


  // ================= CHECKBOX =================
  const toggle = (num, list, setList) => {

    if (list.includes(num))
      setList(list.filter(x => x !== num));
    else
      setList([...list, num]);
  };


  // ================= SELL =================
  const sell = async () => {

    if (!selectedListed.length) return;

    if (!window.confirm("Sell selected tickets?"))
      return;

    await axios.post(
      "https://rangrass-backend.onrender.com/admin/sell",
      { ticketNumbers: selectedListed }
    );

    setSelectedListed([]);
    load();
  };


  // ================= REVERT =================
  const revert = async () => {

    if (!selectedSold.length) return;

    if (!window.confirm("Revert to LISTED?"))
      return;

    await axios.post(
      "https://rangrass-backend.onrender.com/admin/unsell",
      { ticketNumbers: selectedSold }
    );

    setSelectedSold([]);
    load();
  };


  // ================= EXPORT =================
  const exportExcel = async () => {

    const res = await axios.get(
      "https://rangrass-backend.onrender.com/admin/export",
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "tickets.xlsx";
    link.click();
  };


  return (
    <div className="p-4">

      <h1 className="text-3xl text-white font-bold mb-6">
        👑 Admin Panel
      </h1>


      {/* 🎫 SINGLE TICKET */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Add Single Ticket
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Ticket Number"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
        />

        <select
          className="border p-3 rounded w-full mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Early Bird Gold</option>
          <option>Early Bird Fanpit</option>
          <option>Gold</option>
          <option>Fanpit</option>
          <option>Given Gold</option>
          <option>Given Fanpit</option>
          <option>VIP</option>
        </select>

        <button
          className="bg-green-600 text-white w-full py-3 rounded"
          onClick={createSingle}
        >
          Add Single Ticket
        </button>

      </div>


      {/* 🔢 SERIES TICKETS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Generate Series Tickets
        </h2>

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Start Number (e.g. 1000)"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="End Number (e.g. 1050)"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button
          className="bg-purple-600 text-white w-full py-3 rounded"
          onClick={createSeries}
        >
          Generate Series
        </button>

      </div>


      {/* 📋 LISTED TABLE */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Listed Tickets
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th>Select</th>
              <th>Ticket</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {listed.map(t => (
              <tr key={t.ticketNumber} className="border-b">

                <td>
                  <input
                    type="checkbox"
                    checked={selectedListed.includes(t.ticketNumber)}
                    onChange={() =>
                      toggle(
                        t.ticketNumber,
                        selectedListed,
                        setSelectedListed
                      )
                    }
                  />
                </td>

                <td>{t.ticketNumber}</td>
                <td>{t.category}</td>

              </tr>
            ))}
          </tbody>

        </table>

        <button
          className="bg-yellow-500 text-white px-6 py-2 rounded mt-4"
          onClick={sell}
        >
          Sell Selected
        </button>

      </div>


      {/* 💰 SOLD TABLE */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Sold Tickets
        </h2>

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th>Select</th>
              <th>Ticket</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {sold.map(t => (
              <tr key={t.ticketNumber} className="border-b">

                <td>
                  <input
                    type="checkbox"
                    checked={selectedSold.includes(t.ticketNumber)}
                    onChange={() =>
                      toggle(
                        t.ticketNumber,
                        selectedSold,
                        setSelectedSold
                      )
                    }
                  />
                </td>

                <td>{t.ticketNumber}</td>
                <td>{t.category}</td>

              </tr>
            ))}
          </tbody>

        </table>

        <button
          className="bg-orange-600 text-white px-6 py-2 rounded mt-4"
          onClick={revert}
        >
          Revert Selected
        </button>

      </div>


      {/* 📊 EXPORT */}
      <button
        className="bg-blue-600 text-white w-full py-3 rounded"
        onClick={exportExcel}
      >
        Download Excel
      </button>

    </div>
  );
}