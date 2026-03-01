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
  const [loading, setLoading] = useState(true);


  // ================= LOAD =================
  const load = async () => {

    try {
      setLoading(true);

      const [l, s, st] = await Promise.all([
        axios.get(`${API}/admin/unsold`),
        axios.get(`${API}/admin/sold`),
        axios.get(`${API}/admin/stats`)
      ]);

      setListed(l.data || []);
      setSold(s.data || []);
      setStats(st.data || {});
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
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

    await axios.post(`${API}/admin/sell`, {
      ticketNumbers: selectedListed
    });

    setSelectedListed([]);
    load();
  };


  // ================= REVERT =================
  const revert = async () => {

    if (!selectedSold.length) return;
    if (!window.confirm("Revert tickets?")) return;

    await axios.post(`${API}/admin/unsell`, {
      ticketNumbers: selectedSold
    });

    setSelectedSold([]);
    load();
  };


  // ================= EXCEL =================
  const exportExcel = async () => {

    const res = await axios.get(
      `${API}/admin/export`,
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


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );


  // ================= HOME =================
  if (page === "home")
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <h1 className="text-4xl font-bold mb-8 text-center">
          👑 Admin Control Panel
        </h1>

        {/* ===== OVERVIEW ===== */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-500">Listed Tickets</p>
            <p className="text-5xl font-bold mt-2">
              {stats?.listed || 0}
            </p>
          </div>

          <div className="bg-yellow-300 rounded-xl shadow p-6 text-center">
            <p className="text-gray-700">Sold Tickets</p>
            <p className="text-5xl font-bold mt-2">
              {stats?.sold || 0}
            </p>
          </div>

        </div>


        {/* ===== CATEGORY SECTIONS ===== */}

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Listed */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">🎫 Listed Category Wise</h2>

            {(stats?.listedByCategory || []).length === 0 &&
              <p className="text-gray-400">No data</p>
            }

            {(stats?.listedByCategory || []).map(c => (
              <div
                key={c.category}
                className="flex justify-between bg-gray-100 p-2 rounded mb-2"
              >
                <span>{c.category}</span>
                <span className="font-bold">{c._count}</span>
              </div>
            ))}
          </div>

          {/* Sold */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold mb-4">💰 Sold Category Wise</h2>

            {(stats?.soldByCategory || []).length === 0 &&
              <p className="text-gray-400">No data</p>
            }

            {(stats?.soldByCategory || []).map(c => (
              <div
                key={c.category}
                className="flex justify-between bg-yellow-100 p-2 rounded mb-2"
              >
                <span>{c.category}</span>
                <span className="font-bold">{c._count}</span>
              </div>
            ))}
          </div>

        </div>


        {/* ===== EXCEL ===== */}

        <button
          onClick={exportExcel}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mb-8"
        >
          📥 Download Excel
        </button>


        {/* ===== ACTION BUTTONS ===== */}

        <div className="grid md:grid-cols-2 gap-6">

          <button
            onClick={() => setPage("sell")}
            className="bg-yellow-500 text-white py-6 rounded-xl text-xl font-bold"
          >
            💰 SELL TICKETS
          </button>

          <button
            onClick={() => setPage("revert")}
            className="bg-orange-600 text-white py-6 rounded-xl text-xl font-bold"
          >
            🔄 REVERT TICKETS
          </button>

        </div>

      </div>
    );


  // ================= SELL PAGE =================
  if (page === "sell")
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <button
          className="mb-6 text-blue-600 font-semibold"
          onClick={() => setPage("home")}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4">Sell Tickets</h2>

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Search by ticket or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow divide-y">

          {filter(listed).length === 0 &&
            <p className="p-4 text-gray-400">No tickets found</p>
          }

          {filter(listed).map(t => (
            <div
              key={t.ticketNumber}
              className="flex justify-between items-center p-3"
            >
              <input
                type="checkbox"
                checked={selectedListed.includes(t.ticketNumber)}
                onChange={() =>
                  toggle(t.ticketNumber, selectedListed, setSelectedListed)
                }
              />

              <span className="font-medium items-center">{t.ticketNumber}</span>
              <span className="text-gray-500">{t.category}</span>
            </div>
          ))}

        </div>

        <button
          className="bg-yellow-500 text-white w-full py-4 rounded-xl mt-6 font-bold"
          onClick={sell}
        >
          Sell Selected
        </button>

      </div>
    );


  // ================= REVERT PAGE =================
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <button
        className="mb-6 text-blue-600 font-semibold"
        onClick={() => setPage("home")}
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Revert Tickets</h2>

      <input
        className="border p-3 rounded w-full mb-4"
        placeholder="Search by ticket or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow divide-y">

        {filter(sold).length === 0 &&
          <p className="p-4 text-gray-400">No tickets found</p>
        }

        {filter(sold).map(t => (
          <div
            key={t.ticketNumber}
            className="flex justify-between items-center p-3"
          >
            <input
              type="checkbox"
              checked={selectedSold.includes(t.ticketNumber)}
              onChange={() =>
                toggle(t.ticketNumber, selectedSold, setSelectedSold)
              }
            />

            <span className="font-medium">{t.ticketNumber}</span>
            <span className="text-gray-500">{t.category}</span>
          </div>
        ))}

      </div>

      <button
        className="bg-orange-600 text-white w-full py-4 rounded-xl mt-6 font-bold"
        onClick={revert}
      >
        Revert Selected
      </button>

    </div>
  );
}