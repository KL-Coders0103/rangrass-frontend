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
      <div className="text-white p-10 text-center">
        Loading...
      </div>
    );


  // ================= HOME =================
  if (page === "home")
    return (
      <div className="p-4">

        <h1 className="text-3xl text-white font-bold mb-6">
          👑 Admin Control Panel
        </h1>

        {/* 📊 STATS */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <h2 className="font-bold mb-4">📊 Overview</h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-gray-100 p-4 rounded text-center">
              <p>Listed</p>
              <p className="text-2xl font-bold">
                {stats?.listed || 0}
              </p>
            </div>

            <div className="bg-yellow-200 p-4 rounded text-center">
              <p>Sold</p>
              <p className="text-2xl font-bold">
                {stats?.sold || 0}
              </p>
            </div>

          </div>

          {/* LISTED CATEGORY */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">
              🎫 Listed Category Wise
            </h3>

            {(stats?.listedByCategory || []).map(c => (
              <div
                key={c.category}
                className="flex justify-between border-b py-1"
              >
                <span>{c.category}</span>
                <span>{c._count}</span>
              </div>
            ))}
          </div>

          {/* SOLD CATEGORY */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">
              💰 Sold Category Wise
            </h3>

            {(stats?.soldByCategory || []).map(c => (
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

        {/* 📥 EXCEL */}
        <button
          className="bg-blue-600 text-white w-full py-3 rounded mb-6"
          onClick={exportExcel}
        >
          📥 Download Excel
        </button>

        {/* NAV */}
        <div className="grid grid-cols-2 gap-4">

          <button
            className="bg-yellow-500 text-white py-6 rounded-xl text-xl font-bold"
            onClick={() => setPage("sell")}
          >
            💰 SELL
          </button>

          <button
            className="bg-orange-600 text-white py-6 rounded-xl text-xl font-bold"
            onClick={() => setPage("revert")}
          >
            🔄 REVERT
          </button>

        </div>

      </div>
    );


  // ================= SELL PAGE =================
  if (page === "sell")
    return (
      <div className="p-4">

        <button
          className="text-black mb-4"
          onClick={() => setPage("home")}
        >
          ← Back
        </button>

        <input
          className="border p-3 rounded w-full mb-4"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white p-4 rounded-xl shadow">

          {filter(listed).map(t => (
            <div
              key={t.ticketNumber}
              className="flex justify-between border-b py-2"
            >
              <input
                type="checkbox"
                checked={selectedListed.includes(t.ticketNumber)}
                onChange={() =>
                  toggle(t.ticketNumber, selectedListed, setSelectedListed)
                }
              />

              <span>{t.ticketNumber}</span>
              <span>{t.category}</span>
            </div>
          ))}

          <button
            className="bg-yellow-500 text-white w-full py-3 rounded mt-4"
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
        className="text-black mb-4"
        onClick={() => setPage("home")}
      >
        ← Back
      </button>

      <input
        className="border p-3 rounded w-full mb-4"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white p-4 rounded-xl shadow">

        {filter(sold).map(t => (
          <div
            key={t.ticketNumber}
            className="flex justify-between border-b py-2"
          >
            <input
              type="checkbox"
              checked={selectedSold.includes(t.ticketNumber)}
              onChange={() =>
                toggle(t.ticketNumber, selectedSold, setSelectedSold)
              }
            />

            <span>{t.ticketNumber}</span>
            <span>{t.category}</span>
          </div>
        ))}

        <button
          className="bg-orange-600 text-white w-full py-3 rounded mt-4"
          onClick={revert}
        >
          Revert Selected
        </button>

      </div>

    </div>
  );
}