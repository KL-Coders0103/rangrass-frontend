import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://rangrass-backend.onrender.com";

export default function AdminDashboard() {

  const [page, setPage] = useState("home");

  const [listed, setListed] = useState([]);
  const [sold, setSold] = useState([]);

  const [selectedListed, setSelectedListed] = useState([]);
  const [selectedSold, setSelectedSold] = useState([]);

  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(null);


  // ================= LOAD =================
  const load = async () => {

    const l = await axios.get(`${API}/admin/unsold`);
    const s = await axios.get(`${API}/admin/sold`);
    const st = await axios.get(`${API}/admin/stats`);

    setListed(l.data);
    setSold(s.data);
    setStats(st.data);
  };

  useEffect(() => { load(); }, []);


  // ================= FILTER =================
  const filter = (list) => {

    return list.filter(t =>
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  };


  // ================= TOGGLE =================
  const toggle = (num, arr, setArr) => {

    if (arr.includes(num))
      setArr(arr.filter(x => x !== num));
    else
      setArr([...arr, num]);
  };


  // ================= SELL =================
  const sell = async () => {

    if (!selectedListed.length) return;

    if (!window.confirm("Sell selected tickets?")) return;

    await axios.post(
      `${API}/admin/sell`,
      { ticketNumbers: selectedListed }
    );

    setSelectedListed([]);
    load();
  };


  // ================= REVERT =================
  const revert = async () => {

    if (!selectedSold.length) return;

    if (!window.confirm("Revert tickets?")) return;

    await axios.post(
      `${API}/admin/unsell`,
      { ticketNumbers: selectedSold }
    );

    setSelectedSold([]);
    load();
  };


  // ================= HOME =================
  if (page === "home")
    return (
      <div className="p-4">

        <h1 className="text-3xl text-white font-bold mb-6">
          👑 Admin Control Panel
        </h1>

        {/* STATS */}
        {stats && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="font-bold mb-4">📊 Overview</h2>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="text-lg">Listed</p>
                <p className="text-2xl font-bold">{stats.listed}</p>
              </div>

              <div className="bg-yellow-200 p-4 rounded text-center">
                <p className="text-lg">Sold</p>
                <p className="text-2xl font-bold">{stats.sold}</p>
              </div>

            </div>

            {/* CATEGORY */}
            <div className="mt-6">

              <h3 className="font-bold mb-2">
                Category Wise
              </h3>

              {stats.byCategory.map(c => (
                <div
                  key={c.category}
                  className="flex justify-between border-b py-1"
                >
                  <span>{c.category}</span>
                  <span>{c._count}</span>
                </div>
              ))}

            </div>

          </div>
        )}

        {/* NAV BUTTONS */}
        <div className="grid grid-cols-2 gap-4">

          <button
            className="bg-yellow-500 text-white py-6 rounded-xl text-xl font-bold"
            onClick={() => setPage("sell")}
          >
            💰 SELL TICKETS
          </button>

          <button
            className="bg-orange-600 text-white py-6 rounded-xl text-xl font-bold"
            onClick={() => setPage("revert")}
          >
            🔄 REVERT TICKETS
          </button>

        </div>

      </div>
    );


  // ================= SELL PAGE =================
  if (page === "sell")
    return (
      <div className="p-4">

        <button
          className="mb-4 text-white"
          onClick={() => setPage("home")}
        >
          ← Back
        </button>

        <h2 className="text-2xl text-white font-bold mb-4">
          Sell Tickets
        </h2>

        {/* SEARCH */}
        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Search by number or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-4 rounded-xl shadow">

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b">
                <th>Select</th>
                <th>Ticket</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>
              {filter(listed).map(t => (
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

      </div>
    );


  // ================= REVERT PAGE =================
  return (
    <div className="p-4">

      <button
        className="mb-4 text-white"
        onClick={() => setPage("home")}
      >
        ← Back
      </button>

      <h2 className="text-2xl text-white font-bold mb-4">
        Revert Tickets
      </h2>

      {/* SEARCH */}
      <input
        className="border p-3 rounded w-full mb-4"
        placeholder="Search by number or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white p-4 rounded-xl shadow">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b">
              <th>Select</th>
              <th>Ticket</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {filter(sold).map(t => (
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

    </div>
  );
}